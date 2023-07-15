const express = require("express");
const router = express.Router();

// @route   GET /api/auth/
// @desc    Get login data
// @access  private
router.get("/", (req, res) => {
  res.send("Get login data");
});

// @route   POST /api/auth/
// @desc    Login user
// @access  public
router.post("/", (req, res) => {
  res.send("Login user");
});

module.exports = router;
