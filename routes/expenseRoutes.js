// 
const express = require('express');
const userAuthentecation = require('../middleware/authentication');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

// router.get('/get-expenses', userAuthentecation.authenticate, expenseController.getExpenses);
router.post('/add-expense', userAuthentecation.authenticate, expenseController.addExpense);
router.delete('/delete-expense/:id', userAuthentecation.authenticate, expenseController.deleteExpense);
// router.get('/get-expenses', userAuthentecation.authenticate, expenseController.getExpensesByPage);


router.get('/get-expenses', userAuthentecation.authenticate, (req, res, next) => {
    console.log('Route /get-expenses called');
    next();
}, expenseController.getExpensesByPage);


module.exports = router;
