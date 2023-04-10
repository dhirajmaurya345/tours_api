const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("./../models/userModel");
//const validator = require("validator"); for isAlpha (npm install validator)

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A Tour must have less or equal to 40 character"],
      minlength: [10, "A Tour must have more or equal to 10 character"],
      // validate:[validator.isAlpha,"Tour name must contain only characters"] as it will not alllow space also
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a groupe size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a dificulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "A tour must have easy or hard or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "A tour must have atleat 1 ratting"],
      max: [5, "A tour must have atleat 5 ratting"],
    },
    ratingsQuantities: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "a tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a image cover"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    startLocation: {
      //GeoJSON data format is used by mongoDB
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



//virtual populate


//Document Middleware : run before .save() and .create()
//npm install slugify
//each middleware function in pre save have net and we have use multiple middleware
toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

toursSchema.pre("save", async function (next) {
  console.log(this.guides);
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});

//post middleware have access to doc created after pre middleware and also next
// toursSchema.post('save',function(doc,next){
//   console.log(doc)
//   next();
// })

//Query middleware we are using regular express so we can apply all time of fine i.g. fineone, findanddelete etc
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//we can findout time took by query to excute
toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query took time -> ${Date.now() - this.start} milliseconds`);
  //console.log(docs)
  next();
});

toursSchema.pre(/^find/,function(next){
  this.populate({
    path:'guides',
    select:'-__v -passwordChangedAt'
  })
  next();
})

//aggregate middleware
toursSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  //here we are hiding scerettour equal true we are hiding from model
  //we want this to happend before aggregation happens(stats)
});
//this is used to conver from one unit to other
toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

toursSchema.virtual('reviews',{
  ref:"Review",
  foreignField:'tour',
  localField:'_id'
  })

const Tours = new mongoose.model("Tours", toursSchema);

module.exports = Tours;

//Type of middleware in mongoose
//1.Document,2.Query,3.Model,4.Aggregate
