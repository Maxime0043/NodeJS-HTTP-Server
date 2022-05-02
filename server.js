const http = require("http");
const server = http.createServer((req, res) => {
  // ROUTES
  if (req.url === "/") {
    // METHODE GET
    if (req.method === "GET") {
      res.writeHead(200, { "content-type": "text/html" });
      res.write("<h1>HELLO WORLD MAXIME</h1>");
    }
  }

  res.end();
});

server.listen(5000);
