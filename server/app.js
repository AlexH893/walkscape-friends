/**
 * Require statements
 */
require("dotenv").config({ path: "../db.env" });
const express = require("express");
var compression = require("compression");
const http = require("http");
var cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const { Router } = require("express");
const routes = require("./routes");
const Username = require("./models.js");

const port = 3000;
/**
 * App configurations
 */
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../dist/test/browser")));
app.use("/", express.static(path.join(__dirname, "../dist/test")));
app.use(cors());

// MongoDB URI from environment variable
const MONGODB_URI = process.env.DBCON;

/**
 * Database connection
 */
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    mongoose.set("debug", true);
    console.debug(`Connection to the MongoDB database instance was successful`);
    console.log(`MongoDB URI: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.log(`MongoDB Error: ${err.message}`);
    console.log(`MongoDB URI: ${MONGODB_URI}`);
  });

app.use("/api", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
