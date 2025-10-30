// app/api/bedrock-agent/create-agent/route.js
import { NextResponse } from "next/server";
import {
  BedrockAgentClient,
  CreateAgentCommand,
  PrepareAgentCommand,
} from "@aws-sdk/client-bedrock-agent";

export async function POST(req) {
  try {
    const { agentName, instruction } = await req.json();

    // Initialize Bedrock client with credentials
    const client = new BedrockAgentClient({
      region: process.env.BEDROCK_REGION,
    });

    const input = {
      agentName: agentName,
      instruction: instruction,
      foundationModel: process.env.BEDROCK_FOUNDATION_MODEL,
      agentResourceRoleArn: process.env.BEDROCK_AGENT_ROLE_ARN,
      idleSessionTTLInSeconds: 300,
    };

    // Step 1: Create agent
    const createCommand = new CreateAgentCommand(input);
    const createResponse = await client.send(createCommand);
    const agentId = createResponse.agent.agentId;

    console.log(`Agent created with ID: ${agentId}`);

    // Step 2: Wait a moment for agent to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 3: Prepare agent
    const prepareCommand = new PrepareAgentCommand({ agentId });
    const prepareResponse = await client.send(prepareCommand);

    console.log(`Agent prepared: ${agentId}`);

    return NextResponse.json({
      success: true,
      agent: {
        agentId: createResponse.agent.agentId,
        agentName: createResponse.agent.agentName,
        agentStatus: prepareResponse.agentStatus,
        agentVersion: prepareResponse.agentVersion,
      },
    });
  } catch (err) {
    console.error("Error creating/preparing agent:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
