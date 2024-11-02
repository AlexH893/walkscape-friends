const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var createdAt = function () {
  var d = new Date();
  return d;
};

// Define a schema and model for usernames
const usernameSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    steps: { type: Number, default: null },
    createdAt: { type: Date, default: createdAt },
    region: { type: String },
  },

  { collection: "usernames" }
);

const Username = mongoose.model("Username", usernameSchema);
module.exports = Username;
