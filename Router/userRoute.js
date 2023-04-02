const express=require("express");
const userController=require("../controller/userController")
const authController=require("../controller/authController")


const usersRoute = express.Router();

usersRoute.post('/signup',authController.signUp)
usersRoute.post('/login',authController.login)

usersRoute.post('/forgotPassword',authController.forgotPassword)
usersRoute.patch('/resetpassword/:token',authController.resetPassword)
usersRoute.patch('/updatepassword',authController.protect,authController.updatePassword)
usersRoute.patch('/updateme',authController.protect,userController.updateMe) 
usersRoute.delete('/deleteme',authController.protect,userController.deleteMe)  


//Users Route
usersRoute.route("/")
.get(userController.getAllUsers).post(userController.createUser);

usersRoute.route("/:id").get(userController.getUser).patch(userController.updateMe);

module.exports = usersRoute;

