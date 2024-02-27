const express = require("express");

const router = express.Router();
const authController = require("../controllers/auth.controller.js");

router.post("/signup", authController.register);
router.post("/signin", authController.login).get((req, res) => {
  res.json("success");
});
router.post("/forgot-password", authController.forgotPassword);
router.get("/mail_verification", authController.verifyUSerEmail);


// Route to handle reset password request
router.post("/reset-password", authController.resetPassword);

module.exports = router;
