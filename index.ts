import { ReqJson } from "./types";

// read env
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_BOT_UUID = process.env.NEYNAR_BOT_UUID;

const agent_base_url =
  "https://17472d73-f74b-463c-9312-60a511c607c3-00-1f52dvrxswcyb.pike.replit.dev";

const neynar_url = "https://api.neynar.com/v2/farcaster/cast";

const server = Bun.serve({
  hostname: "::",
  port: process.env.PORT ?? 3000,
  async fetch(request) {
    // 使用 async 关键字
    try {
      // 确保请求为 POST 并且内容类型为 JSON
      if (
        request.method === "POST" &&
        request.headers.get("Content-Type") === "application/json"
      ) {
        const reqJson = (await request.json()) as ReqJson; // 尝试解析 JSON
        console.log(reqJson);

        // read reqJson.data.text, post to agent_base_url/chat
        const agentResponse = await fetch(`${agent_base_url}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: reqJson.data?.text,
            fid: reqJson.data?.author?.fid,
            takoId: "",
          }),
        });

        const agentResponseData = await agentResponse.json();
        console.log(agentResponseData);

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
              text: agentResponseData,
              parent: reqJson.data?.hash?,
            }),
          });

          const castResponseJson = await castResponse.json();
          console.log(castResponseJson);
        }

        // 直接返回成功的响应
        const resJsonWeixin = JSON.stringify({
          msgtype: "text",
          text: { content: reqJson },
        }); // 示例响应
        console.log(resJsonWeixin);
        return new Response(resJsonWeixin, {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      // 捕获解析时的错误，但不处理它
      console.error("Error parsing JSON:", error);
    }

    // 如果请求不符合条件，或解析失败，返回默认消息
    const resJsonWeixin = JSON.stringify({
      msgtype: "text",
      text: { content: "Welcome to Bun-neynar!" },
    }); // 示例响应
    console.log(resJsonWeixin);
    return new Response(resJsonWeixin, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
