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
*/
exports.checkBody=(req,res,next)=>{
  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      status:"Failed",
      message:"Doest not contains name or price"
    }) 
  }
  next();
}


//Route Handler
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.addNewTours = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  res.status(201).json({
    status: "success",
    // data: {
    //   tour: tours,
    // },
  });
};

exports.getToursById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

exports.patchToursById = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "Update you tour here...",
    },
  });
};

exports.deleteTourById = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
