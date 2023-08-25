const Errorhandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //   wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new Errorhandler(message, 400);
  }

  // duplicate email error
  if (err.code === 11000) {
    if (err.keyValue && err.keyValue.email) {
      const message = `Duplicate ${err.keyValue.email} entered`;
      err = new Errorhandler(message, 400);
    } else {
      const message = "Duplicate key violation";
      err = new Errorhandler(message, 400);
    }
  }
  // wrong JWT error
  if (err.name === "jsonwebTokenError") {
    const message = `Json web token is invalid plese try again`;
    err = new Errorhandler(message, 400);
  }
  //  JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired try again`;
    err = new Errorhandler(message, 400);
  }
  res.status(err.statusCode).json({
    sucess: false,
    error: err.message,
  });
};
