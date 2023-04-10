const express = require("express");
const reviewController = require("./../controller/reviewController");
const authController = require("./../controller/authController");

const reviewRoute = express.Router({ mergeParams: true });

reviewRoute
  .route("/")
  .get(reviewController.getReview)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.submitReview
  );

module.exports = reviewRoute;
