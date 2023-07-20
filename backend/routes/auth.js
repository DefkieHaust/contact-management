const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../middlewares/auth");

const User = require("../model/User");

const router = express.Router();

// @routes  GET /api/auth
// @desc    get login data
// access   private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      msg: "Server error",
    });
  }
});

// @routes  POST /api/auth
// @desc    Login user
// @access  public
router.post(
  "/",
  [
    check("email", "Please enter valid email").isEmail(),
    check("password", "Please enter your password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          status: 400,
          msg: "User with this email does not exist",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          status: 400,
          msg: "Invalid Password",
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: 500,
        msg: "Sever Error",
      });
    }
  }
);

module.exports = router;
