const express=require("express")
const toureController=require("../controller/toureController")
const toursRoute = express.Router();

// Tours Route
toursRoute
.route("/")
.get(toureController.getAllTours)
.post(toureController.addNewTours);

toursRoute
  .route("/:id")
  .get(toureController.getToursById)
  .patch(toureController.patchToursById)
  .delete(toureController.deleteTourById);

module.exports = toursRoute;
