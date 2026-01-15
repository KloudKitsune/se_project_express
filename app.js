const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const { getClothingItems } = require("./controllers/clothingItems");
const auth = require("./middlewares/auth");
const clothingItemRoute = require("./routes/clothingItems");
const userRouter = require("./routes/users");
const { NOT_FOUND_STATUS_CODE } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

// Public routes (no auth required)
app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getClothingItems);

// Protected routes (auth required)
app.use(auth);
app.use("/users", userRouter);
app.use("/items", clothingItemRoute);

// Catch-all 404 handler (outside auth chain)
app.use((req, res) => {
  res.status(NOT_FOUND_STATUS_CODE).send({ message: "Router not found" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
