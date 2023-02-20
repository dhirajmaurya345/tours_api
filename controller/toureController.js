const fs = require("fs");
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours_simple.json`)
  );
  
  //Route Handler
  exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
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
  
  exports.getToursById = (req, res) => {
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
  
  exports.patchToursById = (req, res) => {
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
  
  exports.deleteTourById = (req, res) => {
    if (req.params.id * 1 > tours.length) {
      res.status(404).json({ status: "Fail", message: "Invalide Id" });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  };