const userService = require("../services/user.service.js");
const jwtProvider = require("../config/jwtProvider.js");
const bcrypt = require("bcrypt");
const cartService = require("../services/cart.service.js");
const emailService = require("../services/email.service.js");
const randomStringService = require("randomstring");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const randomToken = randomStringService.generate();
    const mailSubject = "email verification";
    const toEmail = email;
    const verificationLink = `${process.env.URL}/auth/mail_verification?token=${randomToken}&email=${toEmail}`;
    const content = `<p>Hi ${firstName} ${lastName},<br>Please <a href="${verificationLink}">verify</a> your email.</p>`;
    emailService.sendVerifyEmail(toEmail, mailSubject, content);

    const user = await userService.createUser({
      firstName,
      lastName,
      email,
      password,
      token: randomToken,
    });
    const jwt = jwtProvider.generateToken(user._id);
    await cartService.createCart(user);
    return res.status(200).send({ jwt, message: "Register success" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with email", email });
    }

    // Verify the provided OTP with the OTP stored in the database
    if (user.resetPasswordOTP !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token for successful login
    const jwt = jwtProvider.generateToken(user._id);

    return res.status(200).send({ jwt, message: "Login success" });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).send({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const generateOTP = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };
    const otp = generateOTP();

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user document with generated OTP
    await userService.findByIdAndUpdate(user._id, {
      $set: { resetPasswordOTP: otp },
    });

    await emailService.sendOTPEmail(email, otp);
    return res.status(200).send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Get the user by email
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with email", email });
    }

    // Check if the provided OTP matches the one stored in the user document
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    // Update user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userService.updateUserPassword(user._id, hashedPassword);

    // Clear the resetPasswordOTP field after password reset
    await userService.findByIdAndUpdate(user._id, {
      $unset: { resetPasswordOTP: "" },
    });

    // Generate a new JWT token
    const jwt = jwtProvider.generateToken(user._id);

    // Send the new JWT token along with the response
    return res
      .status(200)
      .send({ jwt, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).send({ error: error.message });
  }
};

const verifyUSerEmail = async (req, res) => {
  try {
    const token = req.query.token;
    const email = req.query.email;
    const user = await userService.findUserByEmail(email, token);
    if (user.token === token) {
      user.isVerified = true;
      // user.token = null;
      await user.save();
      const jwt = jwtProvider.generateToken(user._id);
      const indexPath = path.join(__dirname, "..", "page", "index.ejs");

      res.status(200).render(indexPath, { jwt: jwt, email: user.email });
    } else {
      const indexPath = path.join(__dirname, "..", "page", "index.ejs");
      res.status(400).send({ message: "Login failed" });
    }
  } catch (error) {
    console.error("Error in email verify", error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyUSerEmail,
};
