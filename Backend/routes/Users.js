const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

// User Model
const usersmodel = require("../model/Users");
const Admin = require("../model/Admin");

// test
router.get("/test", (req, res) => res.send("model is working"));

// Create regular user
router.post("/", (req, res) => {
  usersmodel.create(req.body)
    .then(() => res.json({ msg: "User added successfully" }))
    .catch(() => res.status(400).json({ msg: "User adding failed" }));
});

// Create admin user manually (for first-time setup)
router.post("/admin", async (req, res) => {
  try {
    const { username, email, password, role = "admin" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this username or email already exists" });
    }

    // Generate unique admin ID
    const generateAdminId = () => {
      return 'ADMIN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    };

    const newAdmin = new Admin({
      adminId: generateAdminId(),
      username,
      email,
      password,
      role: role || 'admin',
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        adminId: newAdmin.adminId,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });

  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Error creating admin", error: error.message });
  }
});

module.exports = router;
