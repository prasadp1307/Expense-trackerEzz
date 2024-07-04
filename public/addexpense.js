const addExpenseForm = document.querySelector('.addExpenseForm');
const expenseamount = document.querySelector('#expenseamount');
const description = document.querySelector('#description');
const category = document.querySelector('#category');
const expenseList = document.querySelector('.expenseList');
const token = localStorage.getItem('token');
const pageSizeSelector = document.getElementById('pageSizeSelector');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const pageNumberElement = document.getElementById('pageNumber');

// let currentPage = 1;
// let totalPages = 1;

// console.log('Token:', token); 

const addToExpenseList = (expense) => {
    const newLi = document.createElement('li');
    newLi.innerHTML = `<span>&#8377;${expense.expenseamount} - ${expense.category} - ${expense.description} </span><button class="deleteExpense" id="${expense.id}">Delete Expense</button>`;
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










// Load expenses with pagination
const loadExpenses = async (page, pageSize) => {
    try {
        const response = await axios.get(`http://localhost:4000/expenses/get-expenses`, {
            params: { page, pageSize },
            headers: { "Authorization": `Bearer ${token}` }
        });

        const { expenses, currentPage: current, totalPages: total } = response.data;

        expenseList.innerHTML = '';
        expenses.forEach(addToExpenseList);

        currentPage = current;
        totalPages = total; 
        pageNumberElement.textContent = currentPage;

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    } catch (error) {
        console.error("Error loading expenses:", error);
        showError(error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const pageSize = pageSizeSelector.value;
    loadExpenses(currentPage, pageSize);
});

addExpenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const expense = {
        expenseamount: Number(expenseamount.value),
        description: description.value,
        category: category.value
    };

    try {
        // const postedExpense = await axios.post('http://localhost:4000/expenses/add-expense', expense, { headers: { "Authorization": token } });
        // addToExpenseList(postedExpense.data.newExpense); // This line should add the new expense only once

        // Reload the current page to reflect the new expense
        const pageSize = pageSizeSelector.value;
        loadExpenses(currentPage, pageSize);
    } catch (err) {
        console.log(err);
    }
});

document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('deleteExpense')) {
        try {
            const expenseId = e.target.id;
            console.log("Attempting to delete expense ID:", expenseId);

            const deleteRequest = await axios.delete(`http://localhost:4000/expenses/delete-expense/${expenseId}`, { headers: { "Authorization": token } });
            console.log("Delete Request Response:", deleteRequest.data);

            e.target.parentElement.remove();

            // Reload the current page to reflect the deletion
            const pageSize = pageSizeSelector.value;
            loadExpenses(currentPage, pageSize);
        } catch (err) {
            console.log("Error:", err.response ? err.response.data : err.message);
        }
    }
});

pageSizeSelector.addEventListener('change', () => {
    const pageSize = pageSizeSelector.value;
    loadExpenses(1, pageSize); // Reload from the first page with the new page size
});

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        loadExpenses(--currentPage, pageSizeSelector.value);
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        loadExpenses(++currentPage, pageSizeSelector.value);
    }
});

function showError(error) {
    console.error('An error occurred:', error.message || error);
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.textContent = 'An error occurred: ' + (error.message || error);
        errorElement.style.display = 'block';
    } else {
        // alert('An error occurred: ' + (error.message || error));
    }
}