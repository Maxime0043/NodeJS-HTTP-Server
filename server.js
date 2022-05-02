const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  res.write("HELLO WORLD MAXIME");
  res.end();
});

server.listen(5000);
