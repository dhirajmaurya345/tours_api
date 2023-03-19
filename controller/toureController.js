const Tours = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError')
//middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "1";
  req.query.sort = "-ratingsAverage,price";
  //req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//Route Handler
exports.getAllTours =catchAsync(async (req, res,next) => {
    const tours = await Tours.find();
    //Send response
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
});

exports.topcheap =catchAsync( async (req, res,next) => {
    console.log(req.query);
    //execute the query
    const features = new APIFeatures(Tours.find(), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();
    const tours = await features.query;
    //Send response
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
});

exports.addNewTours =catchAsync( async (req, res,next) => {
    const newTour = await Tours.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
});

exports.getToursById =catchAsync(async (req, res,next) => {
      const tour = await Tours.findById(req.params.id);
      if(!tour){
        return next(new AppError(`Item ${req.params.id} doest not exit`,404))
      }
    res.status(200).json({
      status: "success",
      data: { tour },
    });
});

exports.patchToursById =catchAsync(async (req, res,next) => {
     const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: false, //if it is false then validator will not work
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
});

exports.deleteTourById =catchAsync( async (req, res,next) => {
 
    const tour = await Tours.findByIdAndDelete(req.params.id);
    if(!tour){
      return next(new AppError(`Item ${req.params.id} doest not exit`,404))
    }
    res.status(204).json({
      status: "success",
      data: {
        tour,
      },
    });
});

exports.getToursStats =catchAsync( async (req, res,next) => {
     const stats = await Tours.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
});

exports.getMonthlyPlan =catchAsync( async (req, res,next) => {
    const year = req.params.year;
    const plan = await Tours.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0, //it will hide id from api response
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
});

exports.patchToursById =catchAsync( async (req, res,next) => {
    const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
});

