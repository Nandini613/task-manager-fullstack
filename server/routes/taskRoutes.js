const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// Get all tasks (Admin only)
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });
  try {
    const tasks = await Task.find().populate('assignees', 'name email').populate('projectId', 'name').populate('categoryId', 'name colorHex');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tasks assigned to the current member
router.get("/member/my-tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignees: req.user.id })
                            .populate('projectId', 'name')
                            .populate('categoryId', 'name colorHex')
                            .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tasks for a specific project
router.get("/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).populate('assignees', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task in a project
router.post("/:projectId", auth, async (req, res) => {
  try {
    const task = new Task({
      projectId: req.params.projectId,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || "Medium",
      dueDate: req.body.dueDate || null,
      status: req.body.status || "Todo",
      categoryId: req.body.categoryId || null,
      assignees: req.body.assignees || []
    });
    const savedTask = await task.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;