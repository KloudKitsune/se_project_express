const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const clothingItemRoute = require("./clothingItems");
const userRouter = require("./users");
const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");

// Public routes (no auth required)
router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getClothingItems);

// Protected routes (auth required)
router.use("/users", auth, userRouter);
router.use("/items", auth, clothingItemRoute);

// Catch-all 404 handler (outside auth chain)
router.use((req, res) => {
  res.status(NOT_FOUND_STATUS_CODE).send({ message: "Router not found" });
});

module.exports = router;
