const express = require("express");
const cors = require("cors");
const path = require('path'); // Import path module
require("dotenv").config();
require("./db/connectDB");

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/category");
const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const forgotRoutes = require("./routes/forgetpass");
const payment = require("./routes/checkout"); // Razorpay payment route
const resRoutes = require("./routes/resetpage");

// CORS middleware
app.use(cors({
    origin: 'https://silk-route-frontend.vercel.app', // Allow requests from frontend
    credentials: true,
}));

// Middlewares
app.use(express.json()); // For parsing JSON
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// Use a distinct route for serving static files to avoid conflicts
app.use("/uploads/category", express.static(__dirname + "/upload/category"));
app.use("/profile", express.static(__dirname + "/upload/profiles"));
app.use("/products", express.static(__dirname + "/upload/products"));

// Adding routes
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/forgetpassword", forgotRoutes);
app.use("/api/reset", resRoutes);
app.use('/api/payment', payment); // Razorpay payment route

// Catch-all route for handling React Router routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html')); // Adjust the path to your build directory
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
