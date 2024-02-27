const Razorpay = require("razorpay");

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.APIKEY,
  key_secret: process.env.APISECRET,
});

module.exports = razorpay;
