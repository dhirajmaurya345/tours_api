const Tours = require("./../models/tourModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const factory=require('./handlerFactory')

//middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "1";
  req.query.sort = "-ratingsAverage,price";
  //req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTour=factory.getOne(Tours,{path:'reviews'})
exports.createTour=factory.createOne(Tours);
exports.patchToursById=factory.updateOne(Tours);
exports.deleteTourById = factory.deleteOne(Tours);
exports.getAllTours =factory.getAll(Tours);

exports.getToursStats = catchAsync(async (req, res, next) => {
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

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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

