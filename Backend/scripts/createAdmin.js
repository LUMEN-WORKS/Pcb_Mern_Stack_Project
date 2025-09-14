const mongoose = require("mongoose");
const Admin = require("../model/Admin");
const dbconnection = require("../config/DbConnection");

const createDefaultAdmin = async () => {
  try {
    // Connect to database
    await dbconnection();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Default admin already exists");
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin({
      adminId: "ADMIN-" + Date.now(),
      username: "admin",
      email: "admin@pcb3d.com",
      password: "admin123", // Change this in production
      role: "super_admin",
    });

    await admin.save();
    console.log("Default admin created successfully:");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("Email: admin@pcb3d.com");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createDefaultAdmin();
