const { app } = require(".");
const ejs = require("ejs");
const { connectDb } = require("./config/db");

const PORT = 5454;
app.listen(PORT, async () => {
  await connectDb();

  console.log("ecommerce api listing on port ", PORT);
});
