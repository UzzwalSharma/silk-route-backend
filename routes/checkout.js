const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

// Load environment variables
require('dotenv').config();

// Create an instance of Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Accessing key_id from environment variables
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Accessing key_secret from environment variables
});

// Route to create an order
router.post('/order', async (req, res) => {
    const { amount } = req.body;
    
    const options = {
      amount: amount * 100, // Convert to paisa
      currency: 'INR',
      receipt: 'order_rcptid_11', 
    };
  
    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order); 
    } catch (error) {
      console.error('Error while creating Razorpay order:', error); // Log the error
      res.status(500).json({ message: 'Something went wrong', error });
    }
  });
  

module.exports = router;
