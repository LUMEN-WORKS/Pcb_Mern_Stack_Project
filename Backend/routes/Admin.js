const express = require("express");
const router = express.Router();
const Admin = require("../model/Admin");
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [{ username }, { email: username }],
      isActive: true
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        adminId: admin.adminId,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Get admin profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// Create new admin (Super admin only)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    // Check if current admin is super admin
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: "Access denied. Super admin required." });
    }

    const { username, email, password, role } = req.body;

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

// Get all admins (Super admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: "Access denied. Super admin required." });
    }

    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
});

// Verify token
router.get("/verify", authMiddleware, async (req, res) => {
  res.json({
    valid: true,
    admin: {
      adminId: req.admin.adminId,
      username: req.admin.username,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

module.exports = router;
