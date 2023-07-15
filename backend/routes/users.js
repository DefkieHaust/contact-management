const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Users = require("../model/Users");

const router = express.Router();

// @route   POST /api/user/
// desc     Register a new user
// @access  public
router.post(
  "/",
  [
    [check("name", "Please enter your full name.").notEmpty()],
    [check("email", "Please enter your valid email.").isEmail()],
    [
      check(
        "password",
        "Please enter password with at least 6 characters."
      ).isLength({ min: 6 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    try {
      let user = await Users.findOne({ email });
      if (user) {
        return res.status(401).json({
          status: 401,
          msg: "User with this email already exists.",
        });
      }

      user = await new Users({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.status(200).json({
        status: 200,
        msg: "User created successfully!",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ status: 500, msg: "Server Error" });
    }
  }
);

module.exports = router;
