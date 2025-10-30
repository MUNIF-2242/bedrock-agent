import express from "express";
import http from "http";
import next from "next";
import basicAuth from "basic-auth";
import frameguard from "frameguard";
import morgan from "morgan";
import connectDB from "./src/lib/config/DB.js";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// ✅ Basic Auth middleware
const auth = (req, res, next) => {
  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    res.set("WWW-Authenticate", 'Basic realm="Authorization Required"');
    return res.sendStatus(401);
  }

  if (
    user.name === process.env.BASIC_USER &&
    user.pass === process.env.BASIC_USER_PASSWORD
  ) {
    return next();
  } else {
    res.set("WWW-Authenticate", 'Basic realm="Authorization Required"');
    return res.sendStatus(401);
  }
};

nextApp.prepare().then(async () => {
  const app = express();
  const server = http.createServer(app);

  // ✅ Connect to MongoDB before starting the server
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }

  // Security middleware
  app.use(frameguard({ action: "sameorigin" }));

  // Logging middleware
  if (process.env.NODE_ENV !== "test") {
    app.use(
      morgan(":method :url :status :res[content-length] - :response-time ms")
    );
  }

  // ✅ Apply Basic Auth to all non-static routes
  app.use((req, res, nextMiddleware) => {
    if (
      req.url.startsWith("/_next/") ||
      req.url.startsWith("/static/") ||
      req.url.startsWith("/favicon.ico")
    ) {
      return nextMiddleware();
    }
    return auth(req, res, nextMiddleware);
  });

  // Health check route (optional)
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // ✅ Next.js route handler (Express 5 compatible)
  app.all(/.*/, (req, res) => handle(req, res));

  // Start server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
