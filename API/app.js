const express = require("express");
const app = express();

const db = require("./config/db");

db.on("connected", function () {
  console.log("connected!");
});

db.on("disconnected", function () {
  console.log("disconnected!");
});

db.on("error", function (error) {
  console.log("Connection error: " + error);
});

app.use(express.json());

require("./config/routes")(app);

app.listen(4200, function () {
  console.log("Server is on fire.");
});
