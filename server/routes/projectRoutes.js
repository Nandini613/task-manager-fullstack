const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// Get all projects for current user
router.get("/", auth, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({ adminId: req.user.id }).populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user.id }).populate('adminId', 'name email');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a project (Admin only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Not authorized" });
  
  const { name, description } = req.body;
  try {
    const project = new Project({
      name,
      description,
      adminId: req.user.id,
      members: []
    });
    const savedProject = await project.save();
    res.json(savedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add member to project (Admin only)
router.post("/:id/members", auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Not authorized" });
  
  const { email } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.adminId.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized for this project" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: "User already in project" });
    }

    project.members.push(user._id);
    await project.save();
    
    // populate before return
    const populatedProject = await Project.findById(req.params.id).populate('members', 'name email');
    res.json(populatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
