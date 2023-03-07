const mongoose=require('mongoose')
const slugify=require("slugify")
const toursSchema=new mongoose.Schema({
    name:{
      type:String,
      required:[true,"A tour must have a name"],
      unique:true,
      trim:true
    },
    slug:String,
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
  startDates:[Date],
  secreteToure:
  {
    type:Boolean,
    default:false
  }},
  {
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
  })
  
//Document Middleware : run before .save() and .create()  
//npm install slugify
//each middleware function in pre save have net and we have use multiple middleware
toursSchema.pre('save',function(next){
  this.slug=slugify(this.name,{lower:true})
  next();
})

//post middleware have access to doc created after pre middleware and also next
// toursSchema.post('save',function(doc,next){
//   console.log(doc)
//   next();
// })

//Query middleware we are using regular express so we can apply all time of fine i.g. fineone, findanddelete etc
toursSchema.pre(/^find/,function(next){
  this.find({secreteToure:{$ne:true}})
  this.start=Date.now();
  next();
})

toursSchema.post(/^find/,function(docs,next){
console.log(`Query took time -> ${Date.now()-this.start} milliseconds`);
  next();
})
  //this is used to conver from one unit to other
  toursSchema.virtual("durationWeeks").get(function(){
    return this.duration/7;
  })  

const Tours=new mongoose.model('Tours',toursSchema)
  
module.exports=Tours

//Type of middleware in mongoose
//1.Document,2.Query,3.Model,4.Aggregate