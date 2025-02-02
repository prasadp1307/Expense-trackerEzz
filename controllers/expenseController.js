const Expense = require('../models/expense');
const User = require('../util/user');
const sequelize = require('../database/db');

exports.getExpenses = async (req, res, next) => {
    try {
        console.log("Fetching expenses for user ID:", req.user.id);
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        // console.log("Expenses found:", expenses);  
        res.status(200).json(expenses);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getExpensesByPage = async (req, res) => {
    try {
        console.log('Query parameters:', req.query);

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;

        console.log('Page:', page, 'PageSize:', pageSize);

        if (isNaN(page) || isNaN(pageSize)) {
            return res.status(400).json({ message: 'Invalid page or pageSize parameter' });
        }

        const offset = (page - 1) * pageSize;

        console.log('User ID:', req.user.id);

        const { count, rows: expenses } = await Expense.findAndCountAll({
            where: { userId: req.user.id },
            limit: pageSize,
            offset: offset
        });

        console.log('Count:', count, 'Expenses:', expenses);

        const totalPages = Math.ceil(count / pageSize);

        res.status(200).json({
            expenses,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Failed to fetch expenses.' });
    }
};


exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        let { expenseamount, description, category } = req.body;

       
        expenseamount = String(expenseamount).trim();
        description = description.trim();
        category = category.trim();

       
        if (!expenseamount || !description || !category) {
            return res.status(400).json({ message: 'All fields are mandatory' });
        }

        // console.log("Adding Expense:", expenseamount, description, category);

       
        const expense = await Expense.create({
            expenseamount,
            description,
            category,
            userId: req.user.id
        }, { transaction: t });

        // Update total expense for the user
        req.user.totalExpense += Number(expenseamount);
        await req.user.save({ transaction: t });

        await t.commit();

        // Respond with the newly created expense
        res.status(201).json({ newExpense: expense });
    } catch (err) {
     
        await t.rollback();
        console.error("Error adding expense:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};



exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const expenseId = req.params.id;

        // Find the expense to delete
        const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id }, transaction: t });

        if (!expense) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        // Subtract the expense amount from user's totalExpense
        req.user.totalExpense -= expense.expenseamount; 

        // Save the updated user's totalExpense
        await req.user.save({ transaction: t });

        // Delete the expense
        await Expense.destroy({ where: { id: expenseId }, transaction: t });

        
        await t.commit();

       
        res.status(200).json({ success: true, message: "Expense deleted successfully", totalExpense: req.user.totalExpense });
    } catch (err) {
        await t.rollback();
        console.error("Error deleting expense:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



function InvalidString(str){
    return str.length===0 || str === undefined;
}