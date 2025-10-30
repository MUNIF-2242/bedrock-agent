// app/api/bedrock-agent/add-action-group/route.js
import { NextResponse } from "next/server";
import {
  BedrockAgentClient,
  CreateAgentActionGroupCommand,
  PrepareAgentCommand,
  GetAgentCommand,
} from "@aws-sdk/client-bedrock-agent";

export async function POST(req) {
  try {
    const { agentId, actionGroupName, lambdaArn } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: "agentId is required" },
        { status: 400 }
      );
    }

    // Initialize Bedrock client
    const client = new BedrockAgentClient({
      region: process.env.BEDROCK_REGION,
    });

    // Step 1: Get agent version
    const getAgentCommand = new GetAgentCommand({ agentId });
    const agentDetails = await client.send(getAgentCommand);
    const agentVersion = agentDetails.agent?.agentVersion || "DRAFT";

    console.log(`Agent version: ${agentVersion}`);

    // Step 2: Define valid function schema (flat parameter format)
    const functions = [
      {
        name: "getWiFiPassword",
        description: "Retrieve WiFi password for hotel",
        parameters: {},
      },
      //   {
      //     name: "verify_hotel_guest",
      //     description: "Verify if user is a guest at the hotel",
      //     parameters: {
      //       hotel_name: { type: "string", required: true },
      //       guest_email: { type: "string", required: true },
      //       booking_reference: { type: "string", required: false },
      //     },
      //   },
    ];

    // Step 3: Define action group input per AWS Bedrock format
    const actionGroupInput = {
      agentId,
      agentVersion,
      actionGroupName: actionGroupName || "HotelWiFiLookup",
      description: "Look up WiFi password for hotel",
      actionGroupState: "ENABLED",
      actionGroupExecutor: {
        lambda: lambdaArn, // ✅ must be a valid Lambda ARN string
      },
      functionSchema: {
        functions,
      },
    };

    // Step 4: Create action group
    const createActionCommand = new CreateAgentActionGroupCommand(
      actionGroupInput
    );
    const actionResponse = await client.send(createActionCommand);

    console.log(
      `✅ Action group created: ${actionResponse.agentActionGroup.actionGroupName}`
    );

    // Step 5: Wait briefly before preparing agent
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Step 6: Prepare agent (required after adding new action group)
    const prepareCommand = new PrepareAgentCommand({ agentId });
    const prepareResponse = await client.send(prepareCommand);

    console.log(`🚀 Agent re-prepared successfully: ${agentId}`);

    return NextResponse.json({
      success: true,
      actionGroup: {
        actionGroupId: actionResponse.agentActionGroup.actionGroupId,
        actionGroupName: actionResponse.agentActionGroup.actionGroupName,
        functions: functions.map((f) => f.name),
        agentStatus: prepareResponse.agentStatus,
        agentVersion: prepareResponse.agentVersion,
      },
    });
  } catch (err) {
    console.error("❌ Error adding action group:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
