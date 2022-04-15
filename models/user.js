const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("Users", UserSchema);

module.exports = User;
