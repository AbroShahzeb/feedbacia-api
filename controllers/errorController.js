import AppError from "../utils/appError.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateValueDB = (err) => {
  const val = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${val}. Please try another one.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors?.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTInvalidErr = () =>
  new AppError("Invalid token, please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again", 401);

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("Error", err);
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateValueDB(error);
    if (
      error._message === "User validation failed" ||
      error._message === "Product validation failed"
    )
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTInvalidErr();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
