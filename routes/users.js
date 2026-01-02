const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.post("/", createUser);
router.get("/ping", (req, res) => {
  res.status(200).send({ message: "Users route works" });
});
router.get("/:userId", getUser);

module.exports = router;
