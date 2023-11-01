const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  avatar: String,
  password: String,
  birthdate: Date,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ToDo' }]
});

const User = mongoose.model('User', userSchema);

module.exports = {User};
