const toursRoute=require("./Router/tourRoute")
const usersRoute=require("./Router/userRoute")
const express = require("express");
const app = express();
const morgon = require("morgan");
const port = 3004;


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Middleware
app.use(express.json());

//to get logs for api which are callled
app.use(morgon("dev"));


app.use("/api/v1/tours",toursRoute)
app.use("api/v1/users",usersRoute)
//Start server
app.listen(port, () => {
  console.log("Server is running on port :", port);
});
