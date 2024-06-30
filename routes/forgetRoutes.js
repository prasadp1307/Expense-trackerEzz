const express = require('express');
const router = express.Router();
const forgetPasswordController = require('../controllers/passwordController');

router.post('/forgotpassword', forgetPasswordController.forgotPassword);
router.get('/resetpassword/:id', forgetPasswordController.resetPassword);
router.post('/updatepassword/:id', forgetPasswordController.updatePassword);

module.exports = router;
