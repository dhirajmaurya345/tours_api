const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcryptjs"); //npm i bcryptjs

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
    minlength: 8 ,
    select:false
},
passwordConfirm: { 
    type: String, 
    require: true, 
    minlength: 8, 
    validate:{
     validator: function(el){
      return el==this.password;
     },
     message:"Passwords are not same"
    }
}
});

userSchema.pre('save',async function(next){
if(!this.isModified('password'))return next();
this.password=await bcrypt.hash(this.password,12);

this.passwordConfirm=undefined;
next();
})

userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
return bcrypt.compare(candidatePassword,userPassword)
} 

const User=mongoose.model('User',userSchema);
module.exports=User