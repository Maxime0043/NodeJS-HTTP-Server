const fs = require("fs");
const path = require("path");

const memoryDb = new Map(); // est global
let id = 0;

memoryDb.set(id++, { nom: "Alice" }); // voici comment set une nouvelle entrée.
memoryDb.set(id++, { nom: "Bob" });
memoryDb.set(id++, { nom: "Charlie" });

const http = require("http");
const server = http.createServer((req, res) => {
  let result = "";

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
        res.write(result);
        res.end();
      }

      // AUTRES METHODES
      else {
        res.writeHead(405, { "content-type": "text/html" });
        result = fs.readFileSync(
          path.join(__dirname, "public", "pages", "405.html"),
          "utf-8"
        );
        res.write(result);
        res.end();
      }
    }

    // ROUTE PUBLIC
    else if (req.url.match("/public/*")) {
      // METHODE GET
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
        res.write(result);
        res.end();
      }

      // AUTRES METHODES
      else {
        res.writeHead(405, { "content-type": "text/html" });
        result = fs.readFileSync(
          path.join(__dirname, "public", "pages", "405.html"),
          "utf8"
        );
        res.write(result);
        res.end();
      }
    }

    // ROUTE API
    else if (req.url.match("/api/names")) {
      // LISTER / AJOUTER DES DONNEES
      if (req.url === "/api/names") {
        // METHODE GET
        if (req.method === "GET") {
          res.writeHead(200, { "content-type": "application/json" });
          result = Object.fromEntries(memoryDb);
          result = JSON.stringify(result);
          res.write(result);
          res.end();
        }

        // METHODE POST
        else if (req.method === "POST") {
          let data = "";

          req.on("data", (chunk) => {
            data += chunk;
          });

          req.on("end", () => {
            data = JSON.parse(data);

            // Vérification des données envoyées
            if ("name" in data) {
              res.writeHead(201, { "content-type": "application/json" });
              memoryDb.set(id++, { nom: data.name });
              result = JSON.stringify(data);
              res.write(result);
            }

            // Création impossible
            else {
              res.writeHead(424);
            }

            res.end();
          });
        }
      }

      // DETAILLER / SUPPRIMER DES DONNEES
      else if (req.url.match(/\/api\/names\/\d+/g)) {
        let id = parseInt(req.url.split("/")[3]);

        // METHODE GET
        if (req.method === "GET") {
          res.writeHead(200, { "content-type": "application/json" });
          result = Object.fromEntries(memoryDb);
          result = JSON.stringify(result[id]);
          res.write(result);
          res.end();
        }

        // METHODE DELETE
        else if (req.method === "DELETE") {
          res.writeHead(200, { "content-type": "application/json" });
          result = Object.fromEntries(memoryDb);
          result = JSON.stringify(result[id]);

          memoryDb.delete(id);

          res.write(result);
          res.end();
        }

        // METHODE PUT
        else if (req.method === "PUT") {
          let data = "";

          req.on("data", (chunk) => {
            data += chunk;
          });

          req.on("end", () => {
            data = JSON.parse(data);

            // Vérification des données envoyées
            if ("name" in data) {
              res.writeHead(201, { "content-type": "application/json" });
              memoryDb.set(id, { nom: data.name });
              result = JSON.stringify(data);
              res.write(result);
            }

            // Modification impossible
            else {
              res.writeHead(424);
            }

            res.end();
          });
        }
      }

      // AUTRES REQUÊTES
      else {
        res.writeHead(404, { "content-type": "text/html" });
        result = fs.readFileSync(
          path.join(__dirname, "public", "pages", "404.html"),
          "utf8"
        );
        res.write(result);
        res.end();
      }
    }

    // ROUTE INEXISTANTE
    else {
      res.writeHead(404, { "content-type": "text/html" });
      result = fs.readFileSync(
        path.join(__dirname, "public", "pages", "404.html"),
        "utf-8"
      );
      res.write(result);
      res.end();
    }
  } catch (err) {
    res.writeHead(500, { "content-type": "text/html" });
    result = fs.readFileSync(
      path.join(__dirname, "public", "pages", "500.html"),
      "utf-8"
    );
    res.write(result);
    res.end();
  }
});

server.listen(5000);
