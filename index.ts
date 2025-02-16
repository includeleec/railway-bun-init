import { config } from "dotenv";
import { ReqJson } from "./types";

config();

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_BOT_UUID = process.env.NEYNAR_BOT_UUID;

const agent_base_url = process.env.AGENT_BASE_URL;
const neynar_url = "https://api.neynar.com/v2/farcaster/cast";

const server = Bun.serve({
  hostname: "::",
  port: process.env.PORT ?? 3000,
  async fetch(request) {
    try {
      if (
        request.method === "POST" &&
        request.headers.get("Content-Type") === "application/json"
      ) {
        const reqJson = (await request.json()) as ReqJson;

        const agentResponse = await fetch(`${agent_base_url}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: reqJson.data?.text,
            fid: reqJson.data?.author?.fid,
            fusername: reqJson.data?.author?.username,
            takoId: "",
          }),
        });

        const agentResponseData = await agentResponse.json();

        // public cast with neynar
        if (NEYNAR_API_KEY && NEYNAR_BOT_UUID) {
          const castResponse = await fetch(neynar_url, {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "x-api-key": NEYNAR_API_KEY,
            },
            body: JSON.stringify({
              signer_uuid: NEYNAR_BOT_UUID,
              text: (agentResponseData as { response: string }).response,
              parent: reqJson.data?.hash,
            }),
          });
          await castResponse.json();
        }

        return new Response(
          JSON.stringify({
            msgtype: "text",
            text: {
              content: (agentResponseData as { response: string }).response,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (error) {
      console.error("Error:", error);
      return new Response(
        JSON.stringify({
          msgtype: "text",
          text: { content: "Error occurred" },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        msgtype: "text",
        text: { content: "Welcome to Beacon AI" },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  },
});

console.log(`Listening on http://localhost:${server.port}`);
