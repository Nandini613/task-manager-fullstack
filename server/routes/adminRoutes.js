const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

// Get all users and their workloads
router.get("/workloads", authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });

  try {
    const users = await User.find({ role: 'member' }).select('-password');
    const tasks = await Task.find({ status: { $ne: 'Done' } });

    const workloads = users.map(user => {
      const activeTasks = tasks.filter(task => task.assignees.includes(user._id));
      return {
        ...user.toObject(),
        workload: activeTasks.length
      };
    });

    res.json(workloads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle active/suspended
router.put("/users/:id/toggle-status", authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === 'admin') return res.status(400).json({ message: "Cannot suspend admin" });

    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
