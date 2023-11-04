const ApiError = require("../error/ApiError");
const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateJwt = (obj) => {
  return jwt.sign(obj, process.env.SECRET_KEY, { expiresIn: "25d" });
};
class UserController {
  async check(req, res, next) {
    try {
      const { user } = req;
      const token = generateJwt({
        id: user.id,
        email: user.email,
        birthdate: user.birthdate,
        avatar: user.avatar,
        name: user.name,
        phone: user.phone,
        password: user.password,
      });
      return res.json({ token });
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async registration(req, res, next) {
    try {
      const { email, name, password, phone, birthdate } = req.body;
      if (!email || !password || !name || !phone || !birthdate) {
        return next(ApiError.badRequest("Maglumatlaryňyz nädogry"));
      }
      const candidate = await User.findOne({
        $or: [{ email }, { phone }],
      });
      if (candidate) {
        return next(ApiError.badRequest("Bu ulanyjy öň hasaba alyndy"));
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const user = new User({
        email,
        name,
        birthdate,
        phone,
        password: hashPassword,
      });
      await user.save();
      const token = generateJwt({
        id: user.id,
        email: user.email,
        birthdate: user.birthdate,
        avatar: user.avatar,
        name: user.name,
        phone: user.phone,
        password: user.password,
      });
      return res.json({ token });
    } catch (error) {
      console.log(error);
      return next(ApiError.internal(error.message));
    }
  }
  async login(req, res, next) {
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        return next(ApiError.badRequest("Maglumatlaryňyz nädogry"));
      }
      const user = await User.findOne({
        $or: [{ email: login }, { phone: login }],
      });
      if (!user) {
        return next(ApiError.badRequest("Munuň ýaly ulanyjy ýok"));
      }
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest("Açarsöz ýalňyş"));
      }
      const token = generateJwt({
        id: user.id,
        email: user.email,
        birthdate: user.birthdate,
        avatar: user.avatar,
        name: user.name,
        phone: user.phone,
        password: user.password,
      });
      return res.json({ token });
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
}

module.exports = new UserController();
