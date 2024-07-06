const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

const connectResult = mongoose.connection;

connectResult.on("error", () => {
  console.log("connection error");
});
connectResult.on("connected", () => {
  console.log("MongoDB connected successfully");
});

module.exports = connectResult;
