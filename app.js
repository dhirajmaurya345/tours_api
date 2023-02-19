const fs = require("fs");
const express = require("express");
const app = express();
const port = 3004;

//Middleware
app.use(express.json());
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours_simple.json`)
);
app.use((req,res,next)=>{
 req.requestTime=new Date().toISOString();
next()
})

//Route Handler
const getAllTours = (req, res) => {
 console.log(req.requestTime)
  res.status(200).json({
    status: "success",
    requestedAt:req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

const addNewTours = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours_simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: tours,
        },
      });
    }
  );
};

const getToursById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (id > tours.length) {
    res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

const patchToursById = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "Update you tour here...",
    },
  });
};

const deleteTourById = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  res.status(204).json({
    status:"success",
    data: null,
  });
};

//Route
app
.route("/api/v1/tours")
.get(getAllTours)
.post(addNewTours);
app
  .route("/api/v1/tours/:id")
  .get(getToursById)
  .patch(patchToursById)
  .delete(deleteTourById);

  //Start server
app.listen(port, () => {
  console.log("Server is running on port :", port);
});
