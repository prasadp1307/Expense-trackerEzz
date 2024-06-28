// 
const express = require('express');
const userAuthentecation = require('../middleware/authentication');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.get('/get-expense', userAuthentecation.authenticate, expenseController.getExpenses);
router.post('/add-expense', userAuthentecation.authenticate, expenseController.addExpense);
router.delete('/delete-expense/:id', userAuthentecation.authenticate, expenseController.deleteExpense);

module.exports = router;
