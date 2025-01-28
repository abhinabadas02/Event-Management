const mongoose = require("mongoose");
const { type } = require("os");
const UserSchema = new mongoose.Schema({
  username: {type:String},
  email: { type: String, unique: true },
  password: {type:String},
});
const user = mongoose.model("user", UserSchema);
module.exports = user;
