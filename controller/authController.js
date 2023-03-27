const {promisify}=require("util")
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const generatedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SCRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = generatedToken(newUser._id);

  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and password exist
  if (!email || !password) {
    next(new AppError("Please provide email and password", 400));
  }

  //2) check is user exist and password correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(AppError("Email or Password incorrect", 401));
  }

  //3)send token if everythis is right
  const token = generatedToken(user._id);
  res.status(200).json({
    status: "Success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) if token exit
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token=req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return next(new AppError('You are not logged in! Please login to get access',401))
  }
  //2) token validation
  const decoded=await promisify(jwt.verify)(token,process.env.JWT_SCRET)
  //3) check user still exist

  //4) check user changed password after token was issued

  next();
});
