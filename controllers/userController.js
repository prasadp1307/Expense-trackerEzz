const Users = require('../util/user'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Orders = require('../models/orders');
require('dotenv').config();


function InvalidString(str){
    return str.length===0 || str === undefined;
}

const generateToken=(id, name, isPremium)=>{
    return jwt.sign({userId:id, name: name, isPremium },process.env.JSW_TOKEN_SECRETKEY);
}

// // Controller for user Registration
const signupUser = async (req, res) => {
    try {
        const name = req.body.name.trim();
        const email = req.body.email.trim();
        let password = req.body.password.trim();
        console.log(`Sign up with: ${name} ${email} ${password}`);

        if (InvalidString(name) || InvalidString(email) || InvalidString(password)) {
            return res.status(400).json({ err: 'All fields are mandatory' });
        }

        // Validate password length and alphanumeric characters
        if (password.length < 4 || password.length > 8) {
            return res.status(400).json({ err: 'Password must be between 4 and 8 characters long' });
        }
        
        if (!containsLetterAndNumber(password)) {
            return res.status(400).json({ err: 'Password must contain at least one letter and one number' });
        }

        const user = await Users.findAll({ where: { email: email } });
        if (user.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                console.error(`Error hashing password: ${err.message}`);
                return res.status(500).json({ err: 'Error hashing password' });
            }
            try {
                await Users.create({
                    name: name,
                    email: email,
                    password: hash,
                    totalExpense: 0.0 
                });
                res.status(201).json({ message: "Successfully created a new user" });
            } catch (error) {
                console.error(`Error creating user: ${error.message}`);
                res.status(500).json({ err: 'Error creating user' });
            }
        });
    } catch (error) {
        console.error(`Error: ${error.message}`, error);
        res.status(500).json({ err: 'Error submitting' });
    }
};

function containsLetterAndNumber(str) {
    return /[a-zA-Z]/.test(str) && /[0-9]/.test(str);
}

























































// const loginUser = async (req, res) => {
//     try {
//         // Log the entire request body
//         console.log('Request body:', req.body);

//         const { email, password } = req.body;

//         // Check if email and password are provided
//         if (!email || !password) {
//             console.log('Missing email or password');
//             return res.status(400).json({ success: false, message: 'Email and password are required' });
//         }

//         // Trim the email
//         const trimmedEmail = email.trim();

//         console.log(`with: ${trimmedEmail} ${password}`);

//         // Validate input
//         if (Invalidstring(trimmedEmail) || Invalidstring(password)) {
//             return res.status(400).json({ success: false, message: 'All the fields are mandatory' });
//         }

//         // Find user by email
//         const user = await Users.findOne({ where: { email: trimmedEmail } });

//         // If user is found
//         if (user) {
//             // Compare stored password hash with provided password
//             bcrypt.compare(password, user.password, async (err, result) => {
//                 if (err) {
//                     return res.status(500).json({ success: false, message: "Something Went Wrong" });
//                 }

//                 // If passwords match
//                 if (result === true) {
//                     try {
//                         // Check premium status
//                         const premiumCheck = await user.getOrders({ where: { status: 'SUCCESS' } });
//                         const isPremium = premiumCheck.length > 0;

//                         // Generate JWT token with user details
//                         const token = generateToken(user.id, user.name, isPremium);
//                         res.status(201).json({ success: true, message: "Successfully logged in", token });
//                     } catch (err) {
//                         console.error('Error checking premium status:', err);
//                         res.status(500).json({ success: false, message: 'Server error' });
//                     }
//                 } else {
//                     // Handle incorrect password
//                     res.status(401).json({ success: false, message: "Password is incorrect" });
//                 }
//             });
//         } else {
//             // Handle user not found
//             res.status(404).json({ success: false, message: "User not found" });
//         }

//     } catch (err) {
//         // Handle unexpected server errors
//         res.status(500).json({ message: err.message, success: false });
//     }
// }

// function Invalidstring(str) {
//     return (!str || str.trim().length === 0);
// }
const loginUser = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const trimmedEmail = email.trim();

        console.log(`Logging in with: ${trimmedEmail} ${password}`);

        if (Invalidstring(trimmedEmail) || Invalidstring(password)) {
            return res.status(400).json({ success: false, message: 'All the fields are mandatory' });
        }

        const user = await Users.findOne({ where: { email: trimmedEmail } });

        if (user) {
            console.log('User found:', user);

            bcrypt.compare(password, user.password, async (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).json({ success: false, message: "Something went wrong" });
                }

                if (result === true) {
                    try {
                        console.log(`Checking premium status for user ID: ${user.id}`);

                        // Debugging: Log the query parameters
                        const queryParameters = { userId: user.id, status: 'SUCCESSFUL' };
                        console.log('Query Parameters:', queryParameters);

                        const premiumOrders = await Orders.findAll({ where: queryParameters });

                        console.log('Premium Orders:', premiumOrders);
                        
                        // Ensure that orders are retrieved correctly
                        const isPremium = premiumOrders.length > 0;
                        console.log('Is Premium:', isPremium);

                        const token = generateToken(user.id, user.name, isPremium);
                        res.status(201).json({ success: true, message: "Successfully logged in", token });
                    } catch (err) {
                        console.error('Error checking premium status:', err);
                        res.status(500).json({ success: false, message: 'Server error' });
                    }
                } else {
                    res.status(401).json({ success: false, message: "Password is incorrect" });
                }
            });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: err.message, success: false });
    }
};

function Invalidstring(str) {
    return (!str || str.trim().length === 0);
}

// module.exports = { loginUser };







module.exports = {
    signupUser,
    loginUser,
    generateToken
};

