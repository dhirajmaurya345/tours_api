const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.deleteTourById = Model = catchAsync(async (req, res, next) => {
  const data = await Model.findByIdAndDelete(req.params.id);

  if (!data) {
    return next(new AppError(`Item ${req.params.id} doest not exit`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.patchToursById = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: false, //if it is false then validator will not work
    });
    if (!doc) {
      return next(new AppError("No document is found with that ID"), 404);
    }
    res.status(200).json({
      status: "success",
      data: {
        doc
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const createdData = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      Data: {
        createdData,
      },
    });
  });
