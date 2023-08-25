const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getallusers,
  getuser,
  updateuserRole,
  deleteuser,
} = require("../controler/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
// update and change password
router.route("/update").put(isAuthenticatedUser, updatePassword);
// update profile
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
// get all users
router
  .route("/admin/getusers")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getallusers);
module.exports = router;
// get single user
router
  .route("/admin/getoneuser/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getuser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateuserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteuser);
