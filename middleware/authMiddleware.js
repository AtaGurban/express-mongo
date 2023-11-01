const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ body: "Вход не выполнен" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { password, id } = decoded;
    const user = await User.findOne({ id });
    let comparePassword = password === user.password;
    if (comparePassword) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ body: "Вход не выполнен" });
    }
  } catch (e) {
    res.status(401).json({ body: "Вход не выполнен" });
  }
};
