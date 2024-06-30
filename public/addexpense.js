// const { get } = require("../routes/userRoutes"); 

const addExpenseForm = document.querySelector('.addExpenseForm');
const expenseamount = document.querySelector('#expenseamount');
const description = document.querySelector('#description');
const category = document.querySelector('#category');
const expenseList = document.querySelector('.expenseList');
const token = localStorage.getItem('token');

// console.log('Token:', token); 

const addToExpenseList = (expense) => {
    const newLi = document.createElement('li');
    newLi.innerHTML = `<span>${expense.expenseamount} - ${expense.category} - ${expense.description} </span><button class="deleteExpense" id="${expense.id}">Delete Expense</button>`;
    expenseList.appendChild(newLi);
}


// Show Present Expenses (with pagination)
document.addEventListener('DOMContentLoaded', showExpenses);
async function showExpenses(e) {
    try {
        // JSW Decode function
        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        
            return JSON.parse(jsonPayload);
        };

        const userDetails = parseJwt(localStorage.getItem('token'));

        if(userDetails.isPremium === true) {
            document.querySelector('.buyPremium').remove();
            // document.querySelector('.premium').innerHTML = '<p>You are Premium User</p>';
        }
        
        // pagination and expenselist showing
        /*const getExpenses = await axios.get('http://localhost:4000/expenses/addExpense', { headers: { "Authorization": token } });
        getExpenses.data.forEach(expense => {
            addToExpenseList(expense);
        });*/
    }
    catch (err) {
        console.log(err);
    }
}

// Show Present Expenses
document.addEventListener('DOMContentLoaded', showExpenses);
async function showExpenses() {
    try {
        const getExpenses = await axios.get('http://localhost:4000/expenses/get-expense', {
            headers: { "Authorization": token }
        });
        // console.log("Expenses retrieved:", getExpenses.data);
        if (getExpenses.data.length > 0) {
            getExpenses.data.forEach(expense => {
                addToExpenseList(expense);
            });
        } else {
            console.log('No expenses found');
        }
    } catch (err) {
        console.log(err);
    }
}


// Insert in DB
addExpenseForm.addEventListener('submit', postExpenses);
async function postExpenses(e) {
    try {
        e.preventDefault();
        const expense = {
            expenseamount: Number(expenseamount.value),
            description: description.value,
            category: category.value
        };
     
        const postedExpense = await axios.post('http://localhost:4000/expenses/add-expense', expense, { headers: { "Authorization": token } });
        addToExpenseList(postedExpense.data.newExpense);
    } catch (err) {
        console.log(err);
    }
}

// Delete Expense
document.addEventListener('click', deleteExpense);
async function deleteExpense(e) {
    try {
        if (e.target.classList.contains('deleteExpense')) {
            const expenseId = e.target.id;
            console.log("Attempting to delete expense ID:", expenseId);
            const deleteRequest = await axios.delete(`http://localhost:4000/expenses/delete-expense/${expenseId}`, { headers: { "Authorization": token } });
            console.log("Delete Request Response:", deleteRequest.data);
            e.target.parentElement.remove();
        }
    }
    catch (err) {
        console.log("Error:", err.response ? err.response.data : err.message);
    }
}

