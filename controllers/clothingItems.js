const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  INTERNAL_SERVER_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// PUT /items/:id/likes

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_STATUS_CODE)
        .send({ message: "Error liking item" });
    });
};

// DELETE /items/:id/likes
// Unlike an item

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_STATUS_CODE)
        .send({ message: "Error unliking item" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      // Check if the logged-in user is the owner of the item
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(FORBIDDEN_STATUS_CODE).send({
          message: "You do not have permission to delete this item",
        });
      }
      // If user is the owner, delete the item
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        res.status(200).send({ data: deletedItem });
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }

      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }

      return res
        .status(INTERNAL_SERVER_STATUS_CODE)
        .send({ message: "Error deleting item" });
    });
};

// Creating an item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid data for creating item" });
      }

      return res
        .status(INTERNAL_SERVER_STATUS_CODE)
        .send({ message: "Error from createItem" });
    });
};

module.exports = {
  createItem,
  getClothingItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
