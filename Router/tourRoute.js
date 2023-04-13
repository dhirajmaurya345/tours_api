const express = require("express");
const toureController = require("../controller/toureController");
const authController = require("../controller/authController");
const reviewRoute = require("./../Router/reviewRoute");
const toursRoute = express.Router();

//Middleware
//toursRoute.param('id',toureController.checkID)

toursRoute.use("/:tourId/review", reviewRoute);

// Tours Route
toursRoute
  .route("/top-5-cheap")
  .get(toureController.aliasTopTours,toureController.getAllTours);

toursRoute.route("/tour-stats").get(toureController.getToursStats);
toursRoute
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    toureController.getMonthlyPlan
  );

toursRoute
  .route("/")
  .get(toureController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    toureController.createTour
  );

toursRoute
  .route("/:id")
  .get(toureController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    toureController.patchToursById
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    toureController.deleteTourById
  );

module.exports = toursRoute;
