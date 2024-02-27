const mongoose = require("mongoose");

const mongoDbUrl =
  "mongodb+srv://amber:amber@cluster0.evciczt.mongodb.net/ecom?retryWrites=true&w=majority";
const connectDb = () => {
  try {
    return mongoose.connect(mongoDbUrl);
  } catch (err) {
    console.error("Error connectingnect db", err);
  }
};

module.exports = { connectDb };
