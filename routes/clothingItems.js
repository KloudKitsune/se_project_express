const router = require("express").Router();

const {
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const {
  validateCreateClothingItem,
  validateClothingItemId,
} = require("../middlewares/validation");

// Delete /items
router.delete("/:itemId", validateClothingItemId, deleteItem);

// Create /items
router.post("/", validateCreateClothingItem, createItem);

// Likes /items
router.put("/:itemId/likes", validateClothingItemId, likeItem);
router.delete("/:itemId/likes", validateClothingItemId, unlikeItem);

module.exports = router;
