const router = require("express").Router();

router.get("/", () => console.log("GET clothing Items"));
router.delete("/:itemId", () => console.log("DELETE clothing Item"));
router.post("/", () => console.log("POST clothing Item"));

module.exports = router;
