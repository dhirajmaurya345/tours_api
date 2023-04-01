const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
 
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError=()=>new AppError("Invalide token. Please login again",401)
const handleTokenExpiredError=()=>new AppError("Expired token. Please login again",401)

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (error, res) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
     // stack: err.stack
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', error);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: error
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production ') {
    let error = { ...err };
   if (err.name === 'CastError') error = handleCastErrorDB(error);
   if (err.code === 11000) error = handleDuplicateFieldsDB(error);
   if (err.name === 'ValidationError')error = handleValidationErrorDB(error);
   if(err.name=='JsonWebTokenError') error=handleJWTError();
   if(err.name=='TokenExpiredError')error=handleTokenExpiredError();
   sendErrorProd(error, res);
  }
};