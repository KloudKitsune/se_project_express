const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/errors/unauthorized-err");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError("Authorization header is missing");
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    console.error(err);
    throw new UnauthorizedError("Invalid token");
  }
};

module.exports = auth;
