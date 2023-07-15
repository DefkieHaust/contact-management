const express = require("express");
const router = express.Router();

// @route   GET /api/contacts/
// @desc    Get all contacts
// access   private
router.get("/", (req, res) => {
  res.send("Get all contacts.");
});

// @route   POST /api/contacts/
// @desc    Create a new contact
// access   private
router.post("/", (req, res) => {
  res.send("Create a new contact.");
});

// @route   PUT /api/contacts/:id
// @desc    Update a contact by id
// access   private
router.put("/:id", (req, res) => {
  res.send("Update a contact by id.");
});

// @route   DELETE /api/contacts/:id
// @desc    Delete contact by id
// access   private
router.delete("/:id", (req, res) => {
  res.send("Delete contact by id.");
});

module.exports = router;
