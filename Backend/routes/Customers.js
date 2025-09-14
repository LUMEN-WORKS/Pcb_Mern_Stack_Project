const express = require("express");
const router = express.Router();
const Customer = require("../model/Customer");
const Order = require("../model/Order");
const authMiddleware = require("../middleware/auth");

// Get all customers (Admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ registrationDate: -1 });
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
});

// Get customer by ID (Admin only)
router.get("/:customerId", authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.customerId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    // Get customer's orders
    const orders = await Order.find({ customerId: customer._id })
      .sort({ createdAt: -1 });
    
    res.json({
      customer,
      orders,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Error fetching customer", error: error.message });
  }
});

// Update customer (Admin only)
router.put("/:customerId", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, address, company, isActive } = req.body;
    
    const customer = await Customer.findOne({ customerId: req.params.customerId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.address = address || customer.address;
    customer.company = company || customer.company;
    customer.isActive = isActive !== undefined ? isActive : customer.isActive;

    await customer.save();

    res.json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Error updating customer", error: error.message });
  }
});

// Get customer statistics (Admin only)
router.get("/stats/overview", authMiddleware, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ isActive: true });
    const newCustomersThisMonth = await Customer.countDocuments({
      registrationDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    // Get top customers by order count
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: "$customerId",
          orderCount: { $sum: 1 },
          totalCost: { $sum: "$actualCost" }
        }
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $unwind: "$customer"
      },
      {
        $project: {
          customerId: "$customer.customerId",
          name: "$customer.name",
          email: "$customer.email",
          orderCount: 1,
          totalCost: 1
        }
      },
      {
        $sort: { orderCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      topCustomers,
    });
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    res.status(500).json({ message: "Error fetching customer statistics", error: error.message });
  }
});

module.exports = router;
