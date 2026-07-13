const { body, query } = require("express-validator");

const createReviewRules = [
  body("customerName").trim().notEmpty().withMessage("Customer name is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("phone").optional({ checkFalsy: true }).trim().isMobilePhone("any").withMessage("Invalid phone number"),
  body("email").optional({ checkFalsy: true }).trim().isEmail().withMessage("Invalid email address"),
];

const paginationRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
  query("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating filter must be 1-5"),
];

module.exports = { createReviewRules, paginationRules };
