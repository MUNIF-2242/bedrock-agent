// app/api/bedrock/route.js
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

export async function POST(request) {
  try {
    const { message, sessionId } = await request.json();

    const client = new BedrockAgentRuntimeClient({
      region: process.env.BEDROCK_REGION,
    });

    const command = new InvokeAgentCommand({
      agentId: process.env.BEDROCK_AGENT_ID,
      agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID,
      sessionId: sessionId,
      inputText: message,
    });

    const response = await client.send(command);

    let completion = "";

    for await (const event of response.completion) {
      if (event.chunk) {
        const chunk = event.chunk;
        const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
        completion += decodedResponse;
      }
    }

    console.log(response.completion.options.messageStream);

    return Response.json({
      response: completion,
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Bedrock Agent Error:", error);
    return Response.json(
      { error: "Failed to get response from agent" },
      { status: 500 }
    );
  }
}
