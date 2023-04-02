//we only use app.js file in order to configure everything that has to do with express application
//npm i eslint prettier eslint-plugin-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-ally eslint-plugin-react --save-dev
const toursRoute = require("./Router/tourRoute");
const usersRoute = require("./Router/userRoute");
const express = require("express");
//npm i express-rate-limit
const rateLimit = require("express-rate-limit");
//npm i helmet
const helmet = require("helmet");
//npm i express-mongo-sanitize for sql injection
const mongoSanitize = require("express-mongo-sanitize");
// //npm i xss-clean
const xss = require("xss-clean");
//npm i hpp
const hpp = require("hpp");
const app = express();
const morgon = require("morgan");
const globleErrorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");

//Middleware

//set security http headers
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});
app.use("/api", limiter);

//To get date when request was made (test middleware)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//body parser reading data from body intp req.body
app.use(express.json({ limit: "10kb" }));

//Data sanitisation against no sql query injection
app.use(mongoSanitize());

//data sanitize agains xss (html code imbeded in values like name)
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "rattingAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//to get logs for api which are callled (development logging)
if (process.env.NODE_ENV === "development") {
  app.use(morgon("dev"));
}

//to user static file
//app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", toursRoute);
app.use("/users", usersRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find on ${req.originalUrl} on this server`, 404));
});

app.use(globleErrorHandler);

module.exports = app;
