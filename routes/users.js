const router = require("express").Router();
const {
  getCurrentUser,
  getUser,
  updateProfile,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);
router.get("/ping", (req, res) => {
  res.status(200).send({ message: "Users route works" });
});
router.get("/:userId", getUser);

module.exports = router;
