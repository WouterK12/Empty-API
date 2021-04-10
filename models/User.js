const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
});

// initialize and export the model
module.exports = mongoose.model("User", userSchema, "users");
