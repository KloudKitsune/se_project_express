const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateCreateUser } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateCreateUser, updateProfile);

module.exports = router;
