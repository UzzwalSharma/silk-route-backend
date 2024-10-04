const express = require("express");
const cors = require("cors");
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
const allowedOrigins = [
    'https://silkroute-frontend-ku55.vercel.app',
    'https://silkroute-frontend-ku55-r7mjw8sjp-uzzwalsharmas-projects.vercel.app' // Add your new frontend URL here
];

app.use(cors({
    origin: allowedOrigins, // Allow requests from specified origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // Allowed methods
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

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
