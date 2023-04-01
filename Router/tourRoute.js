const express=require("express")
const toureController=require("../controller/toureController")
const authController=require("../controller/authController")

const toursRoute = express.Router();


//Middleware
//toursRoute.param('id',toureController.checkID)

// Tours Route
toursRoute
.route("/top-5-cheap")
//.get(toureController.aliasTopTours,toureController.getAllTours)
.get(toureController.aliasTopTours,toureController.topcheap)

toursRoute
.route("/tour-stats")
.get(toureController.getToursStats)

toursRoute
.route("/monthly-plan/:year")
.get(toureController.getMonthlyPlan)

toursRoute
.route("/")
.get(authController.protect,toureController.getAllTours)
//.post(toureController.checkBody,toureController.addNewTours);
.post(toureController.addNewTours);
toursRoute
  .route("/:id")
  .get(toureController.getToursById)
  .patch(toureController.patchToursById)
  .delete(authController.protect,authController.restrictTo('admin','lead-guide'),toureController.deleteTourById);

module.exports = toursRoute;
