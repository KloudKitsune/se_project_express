const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_STATUS_CODE } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .send({ message: "Authorization header is missing" });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    console.error(err);
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .send({ message: "Invalid token" });
  }
};

module.exports = auth;
