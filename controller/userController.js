
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");



exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      message:"This API is not yet defined"
    },
  });
};
//Create user handler
exports.createUser = (req, res) => {
  res.status(201).json({
    status: "success",
    message: "User Created",
  });
};
//get User by ID handler
exports.getUser = (req, res) => {
  const id = req.params.id * 1;
  const user = User.find((el) => el.id === id);
  if (id > user.length) {
    res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
};
//Update user handler
exports.updateUser = (req, res) => {

  if (req.params.id * 1 > User.length) {
    res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  res.status(200).json({
    status: "success",
    data: {
      user: "Update you users here...",
    },
  });
};
//Detele User handler
exports.deleteUser = (req, res) => {
  if (req.params.id * 1 > User.length) {
    res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};
