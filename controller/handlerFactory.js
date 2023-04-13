const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });

});

exports.updateOne = (Model) =>
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
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
 
    let query = Model.findById(req.params.id);
 
    if (popOptions) {query = Model.findById(req.params.id).populate(popOptions);}
 
    const doc = await query;
    //Send response
    if (!doc) {
      return next(new AppError("No document found with that ID"));
    }

    res.status(200).json({
      status: "success",
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });


  exports.getAll=Model=>catchAsync(async (req, res, next) => {
    let filter = {};
    //to allow for nested GET reviewas on Tour
    if(req.params.tourId) filter = { tour: req.params.tourId };
 
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();
    //const doc = await features.query.explain();
    const doc = await features.query;
    
    //Send response
    res.status(200).json({
      status: "success",
      result: doc.length,
      data: {
        data:doc
      },
    });
  });