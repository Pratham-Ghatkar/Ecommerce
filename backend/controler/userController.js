const Errorhandler = require("../utils/errorhandler");
const catchAsyncerrors = require("../middleware/catchAsyncerror");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
exports.registerUser = catchAsyncerrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample image",
      url: "this pic url",
    },
  });

  const token = user.getJWTtoken();
  sendToken(user, 200, res);
});
// login user
exports.loginUser = catchAsyncerrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given email and password both
  if (!email || !password) {
    return next(new Errorhandler("please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new Errorhandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparepassword(password);
  if (!isPasswordMatched) {
    return next(new Errorhandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
  // const token = user.getJWTtoken();
  // res.status(201).json({
  //   success: true,
  //   token,
  // });
});

exports.logout = catchAsyncerrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
//   Forgot password
exports.forgotPassword = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }
  //  Get ResetPassword token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `your password reset token is:- \n\n ${resetPasswordUrl}\n\nIf you have not requested this email 
  then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Errorhandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncerrors(async (req, res, next) => {
  // creating token hash

  const resetpasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetpasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new Errorhandler(
        "resetpassword token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password != req.body.confirmpassword) {
    return next(new Errorhandler("Password does not matched", 400));
  }
  user.password = req.body.password;
  user.resetpasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  //for logging again
  sendToken(user, 200, res);
});
// get user details
exports.getUserDetails = catchAsyncerrors(async (req, res, send) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password
exports.updatePassword = catchAsyncerrors(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparepassword(req.body.Oldpassword);
  if (!isPasswordMatched) {
    return next(new Errorhandler("Old password is incorrect", 400));
  }

  if (req.body.newpassword != req.body.confirmpassword) {
    return next(new Errorhandler("password does not matched", 400));
  }

  user.password = req.body.newpassword;
  await user.save();
  // login again
  sendToken(user, 200, res);
});

// update user profile
exports.updateProfile = catchAsyncerrors(async (req, res, next) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
  };

  // we will add cloudinary later
  const user = await User.findByIdAndUpdate(req.user.id, newuserdata, {
    new: true,
    runValidators: true,
    usefindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});
// Get all users
exports.getallusers = catchAsyncerrors(async (req, res, next) => {
  const user = await User.find({});
  if (!user) {
    return next(new Errorhandler("users cant find", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});
// get single user
exports.getuser = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new Errorhandler("user not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});
// update user role --Admin
exports.updateuserRole = catchAsyncerrors(async (req, res, next) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newuserdata, {
    new: true,
    runValidators: true,
    usefindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});
// delete user --Admin
exports.deleteuser = catchAsyncerrors(async (req, res, next) => {
  // we will remove cloudinary later
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new Errorhandler(`user does not exist with id:${req.params.id}`, 404)
    );
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "user deleted succesfully",
  });
});
