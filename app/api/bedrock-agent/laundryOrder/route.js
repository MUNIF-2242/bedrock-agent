import LaundryOrder from "@/lib/model/schema/LaundryOrderSchema";

// POST /api/bedrock-agent/laundryOrder
export async function POST(req) {
  try {
    const body = await req.json(); // req.json() in App Router
    const newOrder = new LaundryOrder(body);
    await newOrder.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Laundry order created successfully",
        data: newOrder,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
