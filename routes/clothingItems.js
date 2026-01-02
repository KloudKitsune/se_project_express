const router = require("express").Router();

const { createItem } = require("../controllers/clothingItems");

// CRUD

router.get("/", (req, res) => {
  res.status(200).send({ message: "GET clothing Items" });
});
router.delete("/:itemId", (req, res) => {
  res
    .status(200)
    .send({ message: `DELETE clothing Item ${req.params.itemId}` });
});

// Create
router.post("/", createItem);

// router.post("/", (req, res) => {
//   res.status(201).send({ message: "POST clothing Item", body: req.body });
// });

module.exports = router;
