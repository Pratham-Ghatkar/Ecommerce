const mongoose = require("mongoose");
const validator = require("validator");
const becrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [30, "length cannoot Exceed 30 characters"],
    minlength: [4, "name should have minimum 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "please enter valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minimumlength: [8, "password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetpasswordToken: String,
  resetPasswordExpire: Date,
});

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await becrypt.hash(this.password, 10);
});
// JWT token
userschema.methods.getJWTtoken = function (params) {
  return jwt.sign({ id: this._id }, process.env.JWTsecret, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// compare password
userschema.methods.comparepassword = async function (enteredpassword) {
  return await becrypt.compare(enteredpassword, this.password);
};
// generating password reset token
userschema.methods.getResetPasswordToken = function () {
  //  generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetpasswordtoken to userschema
  this.resetpasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("user", userschema);
