const jwt = require('jsonwebtoken');
const User = require('../util/user');
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }
    
    const userDetails = jwt.verify(token, process.env.JSW_TOKEN_SECRETKEY);
    const user = await User.findByPk(userDetails.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log("Authenticated User:", req.user.id); 
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};


