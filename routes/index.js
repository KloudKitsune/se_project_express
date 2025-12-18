const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRoute = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRoute);

module.exports = router;
