const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs"); //npm i bcryptjs
const crypto = require("crypto");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us you name"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valide email"],
  },
  photo: String,
  password: {
    type: String,
    require: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: true,
    minlength: 8,
    validate: {
      validator: function (el) {
        return el == this.password;
      },
      message: "Passwords are not same",
    },
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  passwordResetToken: String,
  passwordResetExpires:Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});


userSchema.pre(/^find/,async function(next){
  this.find({active:{$ne:false}})
  next();  
})


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});


userSchema.pre('save',function(next){
  if(!this.isModified('password') || !this.isNew){
    return next();
  }
  this.passwordChangedAt=Date.now()-1000;
  next
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //console.log(changedTimeStamp," ",JWTTimestamp)
    return JWTTimestamp < changedTimeStamp;
  }
};



userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest("hex");

    console.log({resetToken},this.passwordResetToken)
    this.passwordResetExpires=Date.now()+10*60*1000;

    return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
