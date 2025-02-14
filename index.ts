const server = Bun.serve({
  hostname: "::",
  port: process.env.PORT ?? 3000,
  fetch(request) {
    const reqJson = await req.json();
    console.log(reqJson);

    if(reqJson) 
    {
      return new Response(resJson);
    } else {
      return new Response("Welcome to Bun-neynar!");
    }
  },
});

console.log(`Listening on http://localhost:${server.port}`);
