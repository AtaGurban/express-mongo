const mongoose = require("mongoose");

const toDoSchema = new mongoose.Schema({
  title: String,
  content: String,
  status: Boolean
});

const ToDo = mongoose.model('ToDo', toDoSchema);

module.exports = {
  ToDo
};