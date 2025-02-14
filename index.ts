const server = Bun.serve({
  hostname: "::",
  port: process.env.PORT ?? 3000,
  async fetch(request) {  // 使用 async 关键字
    try {
      const reqJson = await request.json();  // 修复 req 为 request
      console.log(reqJson);

      if (reqJson) {
        const resJsonWeixin = JSON.stringify({ "msgtype": "text", "text": {"content": "Received JSON successfully!" }}); // 示例响应
        console.log(resJsonWeixin);
        return new Response(resJsonWeixin, { status: 200, headers: { 'Content-Type': 'application/json' } });
      } else {
        return new Response("Welcome to Bun-neynar!", { status: 200 });
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return new Response("Invalid JSON", { status: 400 });
    }
  },
});

console.log(`Listening on http://localhost:${server.port}`);
