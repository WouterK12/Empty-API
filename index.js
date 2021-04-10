const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;

// connect to the database
mongoose.connect("mongodb://localhost/empty_api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established");
});

module.exports = {
  mongoose: mongoose,
  connection: connection,
};

app.use(bodyParser.json()); // for parsing application/json

// load routes
app.use("/api/users", require("./routes/api/users"));

// enable CORS (https://enable-cors.org/server.html)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// server static files
app.use(express.static("./client"));

// start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
