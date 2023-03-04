const Tours = require("./../models/tourModel");

//middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//Route Handler
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //build the query
    //1)Filtering
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "field"];
    excludeField.forEach((el) => delete queryObj[el]);

    //Advance Filter
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
   // console.log(JSON.parse(queryStr));
    let query = Tours.find(JSON.parse(queryStr));
    // console.log("kaniska joshi".replace(/\b( )\b/,match=>` Alpha `))
    //http://localhost:3004/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=5000
    //2)Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
      //http://localhost:3004/api/v1/tours?sort=price
    } else {
      query = query.sort("-createdAt");
    }

    //Field limitation
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
      //here - mean not including
    }

    //Pagination(http://localhost:3004/api/v1/tours?page=2&limit=3)
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 1;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTour = await Tours.countDocuments();
      if (skip >= numTour) {
        throw new Error("This Page does not exist");
      }
    }
    //execute the query
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
