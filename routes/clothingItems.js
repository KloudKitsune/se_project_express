const router = require("express").Router();

const {
  createItem,
  getClothingItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Get /items
router.get("/", getClothingItems);

// Delete /items
router.delete("/:itemId", deleteItem);

// Create /items
router.post("/", createItem);

// Likes /items
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
