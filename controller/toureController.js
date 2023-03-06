const Tours = require("./../models/tourModel");
const APIFeature=require("./../utils/apiFeatures")
//middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '1';
 req.query.sort = '-ratingsAverage,price';
//req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//Route Handler
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    //execute the query
  const features=new APIFeature(Tours.find(),req.query)
    const tours = await query;

    //Send response
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.addNewTours = async (req, res) => {
  try {
    const newTour = await Tours.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.getToursById = async (req, res) => {
  try {
    const tour = await Tours.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.patchToursById = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.deleteTourById = async (req, res) => {
  try {
    const tour = await Tours.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};
