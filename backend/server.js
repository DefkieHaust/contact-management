const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const app = express();

// connect db
connectDB();

// define middleware
app.use(express.json({ extended: false }));

// define routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

app.use("/", (req, res) => {
  res.send("Welcome to the Contact Management App.");
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listning at ${PORT}`);
});
