const express = require("express");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");

const User = require("../model/User");
const Contact = require("../model/Contact");

const router = express.Router();

// @route   GET /api/contacts
// @desc    get all contacts
// @access  private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      msg: "Server Error",
    });
  }
});

// @route   POST /api/contacts
// @desc    create a new contact
// @access  private
router.post(
  "/",
  [
    auth,
    [check("name", "Please enter name").exists()],
    [check("phone", "Please enter valid mobile #").isLength({ min: 11 })],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errors: errors.array(),
      });
    }

    const { name, email, phone, relation } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        relation,
        user: req.user.id,
      });

      await newContact.save();

      res.json(newContact);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: 500,
        msg: "Server error",
      });
    }
  }
);

// @route   PUT /api/contacts/:id
// @desc    update contact by id
// @access  private
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors.array(),
    });
  }

  const { name, email, phone, relation } = req.body;

  try {
    if (!name || !email || !phone) {
      return res.status(400).json({
        status: 400,
        msg: "Data is missing",
      });
    }
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(400).json({
        status: 400,
        msg: "Invalid Contact Id",
      });
    }

    await Contact.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      relation,
    });

    res.json({
      msg: "Contact update successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      msg: "Server Error",
    });
  }
});

// @route   Delete /api/contacts
// @desc    delete contact by id
// @access  private
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(400).json({
        status: 400,
        msg: "Contact not found",
      });
    }

    await Contact.findByIdAndDelete(id);

    res.json({
      msg: "Contact is deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      msg: "Server error",
    });
  }
});

module.exports = router;
