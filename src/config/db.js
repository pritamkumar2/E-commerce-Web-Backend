const mongoose = require("mongoose");
require("dotenv").config();


const mongoDbUrl =process.env.MONGODB
  
const connectDb = () => {
  try {
    return mongoose.connect(mongoDbUrl);
  } catch (err) {
    console.error("Error connectingnect db", err);
  }
};

module.exports = { connectDb };
