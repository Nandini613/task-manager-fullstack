const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const authMiddleware = require("../middleware/authMiddleware");

// Get all categories
router.get("/", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create category
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });

  try {
    const category = new Category({
      name: req.body.name,
      colorHex: req.body.colorHex
    });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete category
router.delete("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });

  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
