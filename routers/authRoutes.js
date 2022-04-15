const express = require("express");
const {
  loginController,
  signupController,
  logoutController,
  getTokenAuth,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginController);
router.post("/signup", signupController);
router.post("/token", getTokenAuth);
router.post("logout", logoutController);

module.exports = router;
