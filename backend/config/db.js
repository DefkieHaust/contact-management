const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

async function connectDB() {
  try {
    await mongoose.connect(db);
    console.log("MongoDB is connected!");
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = connectDB;
