const { promisify } = require("util");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const crypto = require("crypto");

const generatedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SCRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken=(user,statusCode,res)=>{
  const token = generatedToken(user._id);
  res.status(statusCode).json({
    status: "Success",
    token,
    data: {
      user
    },
  });
}

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  createSendToken=(newUser,201,res);
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
    return next(new AppError("Email or Password incorrect", 401));
  }
  //3)send token if everythis is right
  createSendToken(user,200,res)
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) if token exit
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }
  //2) token validation
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SCRET);

  //3) check user still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("User belonging to this token does not exist", 401)
    );
  }
  //console.log(decoded.iat)
  //4) check user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password was changed recently! Please login again", 401)
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  //now roles is array ['admin','lead-guide']
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) get user with posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address", 404));
  }
  //2)generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)Send it you user's email

  res.status(200).json({token:resetToken})

});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if token has not expired , and there is user , set the new password
  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  //3)update changePasswordAt property for user

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //4)log user in , sent JWT
  createSendToken(user,200,res)
});


exports.updatePassword=catchAsync( async(req,res,next)=>{
  //1) get user from collection 
  const currentPassword=req.body.currentPassword;

  const user=await User.findById(req.user.id).select("+password");;

  //2) check is posted current password is correct
  if (!await user.correctPassword(currentPassword, user.password)) {
    return next(new AppError("Incorrect current password", 401));
  }

  //3)if so update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  //4)login user in send JWT
  createSendToken(user,200,res)
})