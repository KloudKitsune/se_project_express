const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("./errors/bad-request-err");
const NotFoundError = require("./errors/not-found-err");
const ConflictError = require("./errors/conflict-err");
const UnauthorizedError = require("./errors/unauthorized-err");

// POST /users
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(201).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("A user with that email already exists"));
      }

      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }

      return next(err);
    });
};

// GET /users/me
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }

      return next(err);
    });
};

// PATCH /users/me
const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }

      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid profile data"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }

      return next(err);
    });
};

// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({ token });
    })
    .catch((err) => {
      if (
        err.message === "User not found" ||
        err.message === "Invalid password"
      ) {
        return next(new UnauthorizedError("Invalid email or password"));
      }

      return next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateProfile,
  login,
};
