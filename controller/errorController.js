module.exports = (err, req, res, next) => {
  //console.log(err.stack)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "err";

  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack:err.stack
    });
  };

  const sendErrorProd = (err, res) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(err.statusCode).json({
        status: err.status,
        message: "Something went wrong",
      });
    }
  };

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
