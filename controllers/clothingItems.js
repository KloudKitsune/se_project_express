const ClothingItem = require("../models/clothingItem");

const {
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from getClothingItems", err });
    });
};

// PUT /items/:id/likes

const likeItem = (req, res) => {
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error liking item" });
    });
};

// DELETE /items/:id/likes
// Unlike an item

const unlikeItem = (req, res) => {
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error unliking item" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }

      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "Invalid item ID" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error deleting item" });
    });
};

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) =>
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from createItem", err })
    );
};

module.exports = {
  createItem,
  getClothingItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
