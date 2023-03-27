//we only use app.js file in order to configure everything that has to do with express application
//npm i eslint prettier eslint-plugin-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-ally eslint-plugin-react --save-dev
const toursRoute = require("./Router/tourRoute");
const usersRoute = require("./Router/userRoute");
const express = require("express");
const app = express();
const morgon = require("morgan");
const globleErrorHandler=require('./controller/errorController')
const AppError=require('./utils/appError')

//To get date when request was made
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
   next();
});

//to get logs for api which are callled
if(process.env.NODE_ENV==="development"){
app.use(morgon("dev"));
}
//Middleware
app.use(express.json());
//to user static file
//app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", toursRoute);
app.use("/users", usersRoute);

app.all("*",(req,res,next)=>{
   next(new AppError(`Can't find on ${req.originalUrl} on this server`,404));
})

 app.use(globleErrorHandler)

module.exports = app ;
