const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = Object.values(err.keyValue);
  const message = `Duplicate field value: '${value}'. please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired please log in again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    messsage: err.message,
    stack: err
  });
};

const sendErrorProd = (err, res) => {
  // Errors that are created using the AppError class.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      messsage: err.message
      // error: err
    });
    // Errors that may arise from the use of third party softwares.
  } else {
    console.error('ERROR ⛔', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
      // error: err
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.kind === 'ObjectId') {
      error = handleCastErrorDB(error);
      sendErrorProd(error, res);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
      sendErrorProd(error, res);
    } else if (error._message?.includes('validation failed')) {
      error = handleValidationErrorDB(error);
      sendErrorProd(error, res);
    } else if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
      sendErrorProd(error, res);
    } else if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
      sendErrorProd(error, res);
    } else {
      sendErrorProd(err, res);
    }
  }
};
