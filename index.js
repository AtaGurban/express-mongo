require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const ErrorHandlingMiddleware = require("./middleware/ErrorHandlingMiddleware");
const app = express();
const path = require("path");
const { User } = require("./models/userModel");
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use("/api/static", express.static(path.resolve(__dirname, "files")));
app.use(
  fileUpload({
    defCharset: "utf8",
    defParamCharset: "utf8",
  })
);

app.use("/api", router);
app.use(ErrorHandlingMiddleware);

const start = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Проверка соединения
    const db = mongoose.connection;
    db.once("error", console.error.bind(console, "MongoDB connection error:"));
    db.on("open", function () {
      console.log("Connected to MongoDB");
    });
    // Запуск сервера
    app.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
