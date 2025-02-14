const server = Bun.serve({
  hostname: "::",
  port: process.env.PORT ?? 3000,
  async fetch(request) {  // 使用 async 关键字
    try {
      // 确保请求为 POST 并且内容类型为 JSON
      if (request.method === 'POST' && request.headers.get('Content-Type') === 'application/json') {
        const reqJson = await request.json();  // 尝试解析 JSON
        console.log(reqJson);

        // 直接返回成功的响应
        const resJsonWeixin = JSON.stringify({ "msgtype": "text", "text": { "content": reqJson } }); // 示例响应
        console.log(resJsonWeixin);
        return new Response(resJsonWeixin, { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    } catch (error) {
      // 捕获解析时的错误，但不处理它
      console.error("Error parsing JSON:", error);
    }

    // 如果请求不符合条件，或解析失败，返回默认消息
    const resJsonWeixin = JSON.stringify({ "msgtype": "text", "text": { "content": "Welcome to Bun-neynar!" } }); // 示例响应
    console.log(resJsonWeixin);
    return new Response(resJsonWeixin, { status: 200, headers: { 'Content-Type': 'application/json' } });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
