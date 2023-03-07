const mongoose=require('mongoose')
const toursSchema=new mongoose.Schema({
    name:{
      type:String,
      required:[true,"A tour must have a name"],
      unique:true,
      trim:true
    },
    duration:{
      type:Number,
      required:[true,"A tour must have a duration"]
    },
    maxGroupSize:{
      type:Number,
      required:[true,"A tour must have a groupe size"]
    },
    difficulty:{
    type:String,
    required:[true,"A tour must have a dificulty"]
    },
    ratingsAverage:{
      type:Number,
      default:4.5
    },
    ratingsQuantities:{
      type:Number,
      default:0
    },
    price:{
      type:Number,
      required:[true,"a tour must have a price"]
    },
    priceDiscount:Number,
    summary:{
      type:String,
      trim:true
    },
  description:{
    type:String,
    trim:true
  },
  imageCover:{
    type:String,
    required:[true,"A tour must have a image cover"]
  },
  images:[String],
  createdAt:{
    type:Date,
    default:Date.now(),
    select:false
  },
  startDates:[Date]
  },
  {
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
  })
  
  //this is used to conver from one unit to other
  toursSchema.virtual("durationWeeks").get(function(){
    return this.duration/7;
  })  

const Tours=new mongoose.model('Tours',toursSchema)
  
module.exports=Tours