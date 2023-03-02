const Tours = require("./../models/tourModel");
//middleware
/*
exports.checkID = (req, res, next, val) => {
  console.log("tours id is ->", val);
  if (val*1 > tours.length) {
    return res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  next();
};

exports.checkBody=(req,res,next)=>{
  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      status:"Failed",
      message:"Doest not contains name or price"
    }) 
  }
  next();
}
*/

//Route Handler
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //build the query
    const queryObj={... req.query}
    const excludeField=['page','sort','limit','field'];
    excludeField.forEach(el=>delete queryObj[el])

    //Advance Filter

    //{difficulty:easy,duration:{$gt:5}}
    //{difficulty:easy,duration:{gt:5}}

    //
    /*
     const query = Tours.find()
       .where("duration")
       .equals(5)
       .where("difficulty")
       .equals("easy");
    */
       const query = await Tours.find(queryObj);

       //execute the query
   const tours=await query;

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
