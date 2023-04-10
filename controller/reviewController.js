const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");

exports.submitReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);

  res.status(200).json({
    status: "Success",
    data: { review },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
let filter={};
if(req.params.tourId)filter={tour:req.params.tourId};
  const reviewData = await Review.find(filter);
  res.status(200).json({
    Status: "Success",
    reviewData,
  });
});
