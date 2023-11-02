const mongoose = require("mongoose");
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  avatar: String,
  password: String,
  birthdate: Date,
  toDos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ToDo' }]
});

UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema);



module.exports = {User};
