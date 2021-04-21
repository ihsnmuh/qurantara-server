const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class UserController {
  static register(req, res, next) {
    const { name, email, password } = req.body;

    User.create({ name, email, password })
      .then((userCreate) => {
        // console.log(userCreate, "<<<<<<<<<<<< INI DI USER CREATE");
        res.status(201).json({
          email: userCreate.email,
          name: userCreate.name,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static login(req, res, next) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((foundUser) => {
        if (foundUser) {
          const passwordCorect = comparePassword(password, foundUser.password);

          if (passwordCorect) {
            const payload = {
              id: foundUser.id,
              email: foundUser.email,
            };
            console.log(payload);
            const access_token = signToken(payload);
            res.status(200).json({
              id: foundUser.id,
              email: foundUser.email,
              name: foundUser.name,
              access_token: access_token,
            });
          } else {
            // res.status(400).json({ message: "Invalid Email / Password" });
            throw { name: "InvalidUserorPassword" };
          }
        } else {
          // res.status(400).json({ message: "Invalid Email / Password" });
          throw { name: "InvalidUserorPassword" };
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = UserController;
