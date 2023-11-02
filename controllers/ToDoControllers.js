const ApiError = require("../error/ApiError");
const fs = require("fs");
const uuid = require("uuid");
const path = require("path");
const { ToDo, ToDoImg } = require("../models/toDoModels");

const deleteFile = async (filePath) => {
  await fs.unlink(
    path.resolve(
      __dirname,
      "..",
      "files",
      "images",
      "todo",
      filePath
    ),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
};
class ToDoController {
  async createToDo(req, res, next) {
    try {
      const { title, content, imgCount } = req.body;
      const { user } = req;
      if (!title || !content || !imgCount) {
        return next(ApiError.badRequest("Maglumatlar doly däl"));
      }
      const todo = new ToDo({
        title,
        content,
        user: user._id, // Привязываем ToDo к пользователю
      });
      for (let i = 0; i < imgCount; i++) {
        const img = req.files[`img[${i}]`];
        const fileNameImg = uuid.v4() + ".jpg";
        await img.mv(
          path.resolve(__dirname, "..", "files", "images", "todo", fileNameImg)
        );
        const todoImage = new ToDoImg({
          img: fileNameImg,
        });
        await todoImage.save();
        todo.images.push(todoImage);
      }
      await todo.save();
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateToDo(req, res, next) {
    try {
      const { title, content, id } = req.body;
      const { user } = req;
      if (!title || !content || !id) {
        return next(ApiError.badRequest("Maglumatlar doly däl"));
      }
      const todo = await ToDo.findById(id);
      if (todo.user !== user._id) {
        return next(ApiError.forbiden("blocked"));
      }
      await ToDo.findByIdAndUpdate(id, { title, content });
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getToDo(req, res, next) {
    try {
      const { id } = req.query;
      if (id) {
        const todo = await ToDo.findById(id);
        return res.json(todo);
      } else {
        const { search } = req.query;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        // Рассчитываем, сколько документов нужно пропустить
        const skip = (page - 1) * limit;
        let filter = {};
        if (search && search !== "") {
          const regex = new RegExp(search, "i");
          filter = { $or: [{ title: regex }, { content: regex }] };
        }
        const todos = await ToDo.find(filter)
          .skip(skip)
          .limit(limit)
          .populate({
            path: "user",
            select: "name email", // Укажите поля пользователя, которые вы хотите получить
          })
          .populate("images"); // Популируем поле images;
        const count = await ToDo.countDocuments(filter);
        return res.json({ rows: todos, count });
      }
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getToDoByUser(req, res, next) {
    try {
      const { user } = req;
      const { search } = req.query;
      let filter = { user: user._id };
      if (search && search !== "") {
        const regex = new RegExp(search, "i");
        filter = { $or: [{ title: regex }, { content: regex }] };
      }
      const todos = await ToDo.find(filter)
        .populate("user") // Популируем поле user
        .populate("images"); // Популируем поле images;
      return res.json(todos);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteTodo(req, res, next) {
    try {
      const { user } = req;
      const { id } = req.query;
      const todo = await ToDo.findById(id);
      if (todo.user !== user._id) {
        return next(ApiError.forbiden("blocked"));
      }
      await ToDo.findByIdAndRemove(id);
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createToDoImg(req, res, next) {
    try {
      const { todoId } = req.body;
      const { user } = req;
      const img = req.files?.img;
      if (!todoId || !img) {
        return next(ApiError.badRequest("Maglumatlar doly däl"));
      }
      const todo = await ToDo.findById(todoId);
      if (todo.user !== user._id) {
        return next(ApiError.forbiden("blocked"));
      }
      const fileNameImg = uuid.v4() + ".jpg";
      await img.mv(
        path.resolve(__dirname, "..", "files", "images", "todo", fileNameImg)
      );
      const todoImage = new ToDoImg({
        img: fileNameImg,
      });
      todo.images.push(todoImage);
      await todo.save();
      await todoImage.save();
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateToDoImg(req, res, next) {
    try {
      const { todoId, id } = req.body;
      const { user } = req;
      const img = req.files?.img;
      if (!todoId || !img) {
        return next(ApiError.badRequest("Maglumatlar doly däl"));
      }
      const todo = await ToDo.findById(todoId);
      if (todo.user !== user._id) {
        return next(ApiError.forbiden("blocked"));
      }
      const todoImg = await ToDoImg.findById(id)
      deleteFile(todoImg.img)
      const fileNameImg = uuid.v4() + ".jpg";
      await img.mv(
        path.resolve(__dirname, "..", "files", "images", "todo", fileNameImg)
      );
      await ToDoImg.findByIdAndUpdate(id, { img: fileNameImg });
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteToDoImg(req, res, next) {
    try {
      const { id } = req.body;
      const { user } = req;
      if (!id) {
        return next(ApiError.badRequest("Maglumatlar doly däl"));
      }
      const todoImgWithTodo = await ToDoImg.findById(id).populate({
        path: "todo",
        select: "user",
      });
      if (todoImgWithTodo.todo.user !== user._id) {
        return next(ApiError.forbiden("blocked"));
      }
      deleteFile(todoImgWithTodo.img)
      await ToDoImg.findByIdAndRemove(id);
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
}

module.exports = new ToDoController();
