const express=require("express");
const userController=require("../controller/userController")
const authController=require("../controller/authController")


const usersRoute = express.Router();

usersRoute.post('/signup',authController.signUp)
usersRoute.post('/login',authController.login)
usersRoute.post('/forgotPassword',authController.forgotPassword)
usersRoute.patch('/resetpassword/:token',authController.resetPassword)

usersRoute.use(authController.protect)

usersRoute.patch('/updateMyPassword',authController.protect,authController.updatePassword)
usersRoute.get('/me',userController.getMe,userController.getUser)
usersRoute.patch('/updateMe',authController.protect,userController.updateMe) 
usersRoute.delete('/deleteMe',userController.deleteMe)

//Protect all route after this middleware
usersRoute.use(authController.restrictTo('admin'));

usersRoute
.route("/")
.get(userController.getAllUsers)

usersRoute
.route("/:id")
.get(userController.getUser)
.patch(userController.updateMe)
.delete(userController.deleteUser)

module.exports = usersRoute;

