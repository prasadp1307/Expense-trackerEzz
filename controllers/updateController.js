const jwt = require('jsonwebtoken');
const Order = require('../models/orders')
const User = require('../util/user'); 
const sequelize = require('../database/db')
const userController = require('./userController');

const generateToken = (id, name, isPremium) => {
    return jwt.sign({ userID: id, name: name, isPremium: isPremium }, process.env.JSW_TOKEN_SECRETKEY);
};

exports.updateTrans = async (req, res, next) => {
    
    try {
        // Extract the authorization token from the request headers
        const token = req.header('Authorization');
        
        const userDetails = jwt.verify(token, process.env.JSW_TOKEN_SECRETKEY);
        
        // Generate a new token with updated user details 
        const newToken = generateToken(userDetails.userId, userDetails.name, true);
        // console.log(newToken)  


        // Destructure payment_id and order_id from the request body
        const { payment_id, order_id } = req.body;
        
        // Find the order in the database by order ID
        const order = await Order.findOne({ where: { orderId: order_id } });

        
        // Update order details and user premium status in parallel using Promise.all
        const promise1 = order.update({ paymentId: payment_id, status: 'SUCCESSFUL' });
        const promise2 = req.user.update({ ispremiumuser: true });

        // Wait for both promises to resolve
        Promise.all([promise1, promise2]).then(() => {
            // On success, return a response with the new token and a success message
            return res.status(202).json({
                success: true,
                message: "Transaction Successful",
                token: userController.generateToken(userDetails.userId, undefined, true)
            });
        }).catch((error) => {
            // Handle any errors that occurred during the updates
            throw new Error(error);
        });

       
        // res.status(201).json({ token: newToken, order });
    } catch (err) {
        
        // Log any errors that occur during the process
        console.error(err);
        
        // Send a 500 response indicating a server error
        res.status(500).json({ message: "Server error", error: err });
    }
};











