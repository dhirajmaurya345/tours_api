const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const filertObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please user /upddateMyPassword",
        400
      )
    );
  }
  // Filtered out unwanted fields name that are not allow to update
  const filteredBody = filertObj(req.body, "name", "email");
  //Updated user

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

//get
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(500).json({
    status: "success",
    data: {
      user,
    },
  });
});

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

//Detele User handler
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
  next();
});
