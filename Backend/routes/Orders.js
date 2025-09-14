const express = require("express");
const router = express.Router();
const Order = require("../model/Order");
const Customer = require("../model/Customer");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");

// Generate unique order ID
const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Generate unique customer ID
const generateCustomerId = () => {
  return 'CUST-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Create new order with PDF upload
router.post("/", upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const {
      serviceType,
      name,
      email,
      phone,
      address,
      company,
      projectDescription,
      quantity,
      specifications,
      deadline
    } = req.body;

    // Validate required fields
    if (!serviceType || !name || !email || !phone || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if customer exists, if not create new one
    let customer = await Customer.findOne({ email });
    if (!customer) {
      customer = new Customer({
        customerId: generateCustomerId(),
        name,
        email,
        phone,
        address,
        company: company || '',
      });
      await customer.save();
    }

    // Create new order
    const order = new Order({
      orderId: generateOrderId(),
      customerId: customer._id,
      serviceType,
      pdfFile: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
      },
      customerDetails: {
        name,
        email,
        phone,
        address,
        company: company || '',
        projectDescription: projectDescription || '',
        quantity: quantity ? parseInt(quantity) : 1,
        specifications: specifications || '',
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    await order.save();

    // Emit real-time notification to admin dashboard
    req.app.get('io').emit('newOrder', {
      orderId: order.orderId,
      customerName: name,
      serviceType,
      timestamp: order.createdAt,
    });

    res.status(201).json({
      message: "Order created successfully",
      orderId: order.orderId,
      customerId: customer.customerId,
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});

// Get all orders (Admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'customerId name email phone')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// Get order by ID (Admin only)
router.get("/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('customerId', 'customerId name email phone address company');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
});

// Update order status (Admin only)
router.put("/:orderId/status", authMiddleware, async (req, res) => {
  try {
    const { status, adminNotes, estimatedCost, actualCost } = req.body;
    
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status || order.status;
    order.adminNotes = adminNotes || order.adminNotes;
    order.estimatedCost = estimatedCost || order.estimatedCost;
    order.actualCost = actualCost || order.actualCost;
    order.updatedAt = new Date();

    await order.save();

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
});

// Get order PDF file (Admin only)
router.get("/:orderId/pdf", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const filePath = order.pdfFile.path;
    res.download(filePath, order.pdfFile.originalName);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    res.status(500).json({ message: "Error downloading PDF", error: error.message });
  }
});

module.exports = router;
