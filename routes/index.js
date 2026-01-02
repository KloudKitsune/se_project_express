const router = require("express").Router();
const NOT_FOUND_ERROR_CODE = require("../utils/errors");

const userRouter = require("./users");
const clothingItemRoute = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRoute);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Router not found" });
});

module.exports = router;
