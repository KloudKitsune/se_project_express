const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const clothingItemRoute = require("./clothingItems");
const userRouter = require("./users");
const NotFoundError = require("../utils/errors/not-found-err");
const {
  validateLogin,
  validateCreateUser,
} = require("../middlewares/validation");

// Public routes (no auth required)
router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);
router.get("/items", getClothingItems);

// Protected routes (auth required)
router.use("/users", auth, userRouter);
router.use("/items", auth, clothingItemRoute);

// Catch-all 404 handler (outside auth chain) - throw error for centralized handling
router.use((next) => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
