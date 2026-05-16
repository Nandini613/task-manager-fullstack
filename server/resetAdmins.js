const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const resetAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for resetting admins");

    // Delete all admins
    const result = await User.deleteMany({ role: 'admin' });
    console.log(`Deleted ${result.deletedCount} previous admin(s).`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("nandin123", salt);

    const adminUser = new User({
      name: "Master Admin",
      email: "nandini11sh@gmail.com",
      password: hashedPassword,
      role: 'admin'
    });
    
    await adminUser.save();
    console.log(`Successfully created master admin: nandini11sh@gmail.com`);

    process.exit(0);
  } catch (error) {
    console.error("Error resetting admins:", error);
    process.exit(1);
  }
};

resetAdmins();
