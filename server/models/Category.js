const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  colorHex: { type: String, default: "#6366f1" }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
