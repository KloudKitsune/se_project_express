const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("./errors/bad-request-err");
const NotFoundError = require("./errors/not-found-err");
const ForbiddenError = require("./errors/forbidden-err");

// GET /items
const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch(next); // let centralized middleware handle 500
};

// PUT /items/:itemId/likes
const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError("Item not found"));
      }

      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError("Invalid item ID"));
      }

      return next(err);
    });
};

// DELETE /items/:itemId/likes
const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError("Item not found"));
      }

      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError("Invalid item ID"));
      }

      return next(err);
    });
};

// DELETE /items/:itemId
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }

      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      res.status(200).send({ data: deletedItem });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError("Item not found"));
      }

      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError("Invalid item ID"));
      }

      return next(err);
    });
};

// POST /items
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError("Invalid data for creating item"));
      }

      return next(err);
    });
};

module.exports = {
  createItem,
  getClothingItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
