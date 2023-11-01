const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8080;

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });

// Проверка соединения
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Настройка маршрутов
app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
