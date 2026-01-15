const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);
router.get("/ping", (req, res) => {
  res.status(200).send({ message: "Users route works" });
});

module.exports = router;
