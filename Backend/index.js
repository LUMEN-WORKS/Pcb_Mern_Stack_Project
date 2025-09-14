const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const dbconnection = require("./config/DbConnection");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const cors = require("cors");
const bodyParser = require("body-parser");

// Routes
const userRouter = require("./routes/Users");
const orderRouter = require("./routes/Orders");
const adminRouter = require("./routes/Admin");
const customerRouter = require("./routes/Customers");

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (PDFs)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
dbconnection();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Admin connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("Admin disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.get("/", (req, res) => res.send("PCB & 3D Printing Service API"));
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/customers", customerRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  console.log(`Socket.IO server is running`);
});