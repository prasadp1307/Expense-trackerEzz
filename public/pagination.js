let currentPage = 1;
let totalPages = 1;

// // This function handles the change in page size selector
function pageSelectorChanged(event) {
    console.log(event.target.value);
    const token = localStorage.getItem('token');
    const pageSize = event.target.value;
    const page = 1;  // Reset to first page when page size changes
    loadExpenses(page, pageSize);
}


// Event listener for click events (delegation to handle dynamically added delete buttons)
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('deleteExpense')) {
        try {
            const expenseId = e.target.id;
            console.log("Attempting to delete expense ID:", expenseId);
            
            // Send delete request to the server
            const deleteRequest = await axios.delete(`http://localhost:4000/expenses/delete-expense/${expenseId}`, { headers: { "Authorization": token } });
            console.log("Delete Request Response:", deleteRequest.data);
            
            // Remove the deleted expense item from the UI
            e.target.parentElement.remove();
            
          
            const selector = document.getElementById('pageSizeSelector');
            const pageSize = selector.value;
            const page = 1; 
            getData(page, pageSize, token); 
        } catch (err) {
            console.log("Error:", err.response ? err.response.data : err.message);
        }
    }
});

// Function to render expense list with delete buttons
function renderExpenseList(expenses) {
    const expenseList = document.querySelector('.expenseList');
    expenseList.innerHTML = ''; // Clear previous content

    expenses.forEach(expense => {
        const newLi = document.createElement('li');
        newLi.innerHTML = `<span>&#8377;${expense.expenseamount} - ${expense.category} - ${expense.description}</span><button class="deleteExpense" id="${expense.id}">Delete Expense</button>`;
        expenseList.appendChild(newLi);
    });
}

// Function to fetch data and render expense list (example getData function)
async function getData(page, pageSize, token) {
    try {
        const response = await axios.get(`http://localhost:4000/expenses/get-expenses`, {
            params: { page, pageSize },
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const { expenses, currentPage, totalPages } = response.data;
        renderExpenseList(expenses);

        // Handle pagination UI updates if needed
        document.getElementById('pageNumber').innerText = currentPage;



        // Update totalPagesElement based on your pagination logic
        document.getElementById('prevPage').disabled = currentPage === 1;
        document.getElementById('nextPage').disabled = currentPage === totalPagesElement;

        localStorage.setItem('pageSize', pageSize);
    } catch (error) {
        console.error("Error loading expenses:", error);
        showError(error);
    }
}
