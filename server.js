const fs = require("fs");
const path = require("path");

const memoryDb = new Map(); // est global
let id = 0;

memoryDb.set(id++, { nom: "Alice" }); // voici comment set une nouvelle entrée.
memoryDb.set(id++, { nom: "Bob" });
memoryDb.set(id++, { nom: "Charlie" });

const http = require("http");
const server = http.createServer((req, res) => {
  let result;

  try {
    // ROUTES
    if (req.url === "/") {
      // METHODE GET
      if (req.method === "GET") {
        res.writeHead(200, { "content-type": "text/html" });
        result = fs.readFileSync(
          path.join(__dirname, "public", "pages", "index.html"),
          "utf-8"
        );
      } else {
        res.writeHead(405, { "content-type": "text/html" });
        result = fs.readFileSync(
          path.join(__dirname, "public", "pages", "405.html"),
          "utf-8"
        );
      }
    } else if (req.url.match("/public/*")) {
      if (req.method === "GET") {
        let file = req.url.split("/")[2].split(".");
        let contentType = "";

        if (file[1] === "js") contentType = "application/javascript";
        else if (file[1] === "css") contentType = "text/css";
        else if (file[1] === "jpg") contentType = "image/jpg";

        res.writeHead(200, { "content-type": contentType });
        result = fs.readFileSync(
          path.join(__dirname, "public", file[1], file[0] + "." + file[1])
        );
      } else {
        res.writeHead(405, { "content-type": "text/html" });
        result = fs.readFileSync(
          path.join(__dirname, "public", "pages", "405.html"),
          "utf8"
        );
      }
    } else if (req.url === "/api/names") {
      if (req.method === "GET") {
        res.writeHead(404, { "content-type": "application/json" });
        result = Object.fromEntries(memoryDb);
        result = JSON.stringify(result);
      }
    } else {
      res.writeHead(404, { "content-type": "text/html" });
      result = fs.readFileSync(
        path.join(__dirname, "public", "pages", "404.html"),
        "utf-8"
      );
    }
  } catch (err) {
    res.writeHead(500, { "content-type": "text/html" });
    result = fs.readFileSync(
      path.join(__dirname, "public", "pages", "500.html"),
      "utf-8"
    );
  }

  res.write(result);
  res.end();
});

server.listen(5000);
