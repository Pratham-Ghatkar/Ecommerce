const userModel = require("../models/userModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncerror = require("./catchAsyncerror");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
exports.isAuthenticatedUser = catchAsyncerror(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Errorhandler("Please Login to access this resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWTsecret);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Errorhandler(
          `Role:${req.user.role} is not allowed to access this resource`,
          404
        )
      );
    }
    next();
  };
};
