const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');
const Order = require('../models/orders'); 
require('dotenv').config();

exports.purchasePremium = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = req.header('price');

        rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error in creating order", error: err });
            }

            try {
                // Store the userId with the order details in the database
                await Order.create({ userId: req.user.id, orderId: order.id, paymentId: 'PENDING', status: 'PENDING' });
                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Error in creating order record", error: err });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err });
    }
};


