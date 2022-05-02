const fs = require("fs");
const path = require("path");

const http = require("http");
const server = http.createServer((req, res) => {
  let htmlPageContent;

  try {
    // ROUTES
    if (req.url === "/") {
      // METHODE GET
      if (req.method === "GET") {
        res.writeHead(200, { "content-type": "text/html" });
        htmlPageContent = fs.readFileSync(
          path.join(__dirname, "public", "pages", "index.html"),
          "utf-8"
        );
      } else {
        res.writeHead(405, { "content-type": "text/html" });
        htmlPageContent = fs.readFileSync(
          path.join(__dirname, "public", "pages", "405.html"),
          "utf-8"
        );
      }
    } else if (req.url === "/public/images/image.jpg") {
      if (req.method === "GET") {
        res.writeHead(200, { "content-type": "image/jpeg" });
        htmlPageContent = fs.readFileSync(
          path.join(__dirname, "public", "images", "image.jpg")
        );
      }
    } else if (req.url === "/public/css/style.css") {
      if (req.method === "GET") {
        res.writeHead(200, { "content-type": "text/css" });
        htmlPageContent = fs.readFileSync(
          path.join(__dirname, "public", "css", "style.css")
        );
      }
    } else if (req.url === "/public/js/script.js") {
      if (req.method === "GET") {
        res.writeHead(200, { "content-type": "application/javascript" });
        htmlPageContent = fs.readFileSync(
          path.join(__dirname, "public", "js", "script.js")
        );
      }
    } else {
      res.writeHead(404, { "content-type": "text/html" });
      htmlPageContent = fs.readFileSync(
        path.join(__dirname, "public", "pages", "404.html"),
        "utf-8"
      );
    }
  } catch (err) {
    res.writeHead(500, { "content-type": "text/html" });
    htmlPageContent = fs.readFileSync(
      path.join(__dirname, "public", "pages", "500.html"),
      "utf-8"
    );
  }

  res.write(htmlPageContent);
  res.end();
});

server.listen(5000);
