const http = require("http");
const fs = require("fs");
const port = process.env.PORT || 5000;

fs.readFile("./index.html", function (err, html) {
  if (err) {
    throw err;
  }
  http
    .createServer(function (request, response) {
      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(html);
      response.end();
      console.log("localhost: " + port)
    })
    .listen(port);
});
