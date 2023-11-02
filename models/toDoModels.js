const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const ToDoSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "ToDoImg" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Добавлено поле user
});

const ToDoImgSchema = new mongoose.Schema({
  img: String,
  todo: { type: mongoose.Schema.Types.ObjectId, ref: "ToDo" }, // Добавляем поле todo
});

ToDoSchema.plugin(timestamp);
ToDoImgSchema.plugin(timestamp);

// Middleware для удаления ToDo
ToDoSchema.pre('remove', async function (next) {
  try {
    // Удалить связанные фотографии
    await mongoose.model('ToDoImg').deleteMany({ _id: { $in: this.images } });
    next();
  } catch (error) {
    next(error);
  }
});
// Middleware для удаления ToDoImg
ToDoImgSchema.pre('remove', async function (next) {
  try {
    // Удалить связанные ToDo
    await mongoose.model('ToDo').updateMany({}, { $pull: { images: this._id } });
    next();
  } catch (error) {
    next(error);
  }
});

const ToDo = mongoose.model("ToDo", ToDoSchema);
const ToDoImg = mongoose.model("ToDoImg", ToDoImgSchema);

module.exports = {
  ToDo,
  ToDoImg,
};
