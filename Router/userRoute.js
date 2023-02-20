const express=require("express");
const userController=require("../controller/userController")
const usersRoute = express.Router();

//Users Route
usersRoute.route("/").get(userController.getAllUsers).post(userController.createUser);

usersRoute.route("/:id").get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = usersRoute;
