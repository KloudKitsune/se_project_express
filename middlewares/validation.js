const { Joi, celebrate, Segments } = require("celebrate");
const validator = require("validator");

// Custom URL validator
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri"); // matches Joi URI error code
};

// 1️⃣ Clothing item creation validation
const validateCreateClothingItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
  }),
});

// 2️⃣ User creation validation
const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 3️⃣ Login validation
const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 4️⃣ User ID validation (URL param)
const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.empty": 'The "userId" field must be filled in',
      "string.hex": 'The "userId" field must be a valid hex',
      "string.length": 'The "userId" field must be 24 characters',
    }),
  }),
});

// 5️⃣ Clothing item ID validation (URL param)
const validateClothingItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.empty": 'The "itemId" field must be filled in',
      "string.hex": 'The "itemId" field must be a valid hex',
      "string.length": 'The "itemId" field must be 24 characters',
    }),
  }),
});

module.exports = {
  validateCreateClothingItem,
  validateCreateUser,
  validateLogin,
  validateUserId,
  validateClothingItemId,
};
