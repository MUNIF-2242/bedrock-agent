"use client";

import React from "react";
import styles from "./page.module.css";

export default function Home() {
  const handleCreateAgent = async () => {
    try {
      const res = await fetch("/api/bedrock-agent/createAgent", {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message || "Agent created successfully!");
    } catch (err) {
      alert("Error creating agent");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Bedrock Agent Builder</h1>
        <p className={styles.subtitle}>
          Build, deploy, and manage your AI agents programmatically — directly
          from your Next.js app.
        </p>
        <button onClick={handleCreateAgent} className={styles.createButton}>
          🚀 Create Agent
        </button>
      </div>

      <div className={styles.visuals}>
        <div className={styles.card}>
          <h3>⚙️ One-click Setup</h3>
          <p>Quickly initialize your Bedrock agent with a single API call.</p>
        </div>
        <div className={styles.card}>
          <h3>🤝 Multi-Agent Collaboration</h3>
          <p>Connect and manage multiple AI collaborators seamlessly.</p>
        </div>
        <div className={styles.card}>
          <h3>📊 Real-time Insights</h3>
          <p>Monitor usage, responses, and performance analytics easily.</p>
        </div>
      </div>
    </div>
  );
}
