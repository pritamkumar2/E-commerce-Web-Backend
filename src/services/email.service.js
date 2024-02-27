const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

// Function to send OTP email
const sendOTPEmail = async (toEmail, otp, randomstring) => {
  try {
    await transporter.sendMail({
      from: "pri.300118@gmail.com",
      to: toEmail,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

const sendVerifyEmail = async (toEmail, mailSubject, content) => {
  try {
    await transporter.sendMail({
      from: "pri.300118@gmail.com",
      to: toEmail,
      subject: mailSubject,
      html: content,
    });
    console.log("vrefication mail sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

module.exports = { sendOTPEmail, sendVerifyEmail };
