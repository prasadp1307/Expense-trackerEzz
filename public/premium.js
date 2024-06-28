document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            console.log('Decoded Token:', decodedToken); 
            
            if (decodedToken.isPremium) {
                document.querySelector('.premium').innerHTML = '<p><h4>&#x1F451; You are a Premium User &#x1F451;<h4></p>';
            } else {
                document.querySelector('.premium').innerHTML = '<p>You are not a Premium User</p>';
            }
            localStorage.setItem("isPremium",decodedToken.isPremium)
        } catch (err) {
            console.error('Error decoding token:', err);
        }
    } else {
        console.log('No token found');
    }
});

const updateTokenAndUI = (newToken) => {
    localStorage.setItem('token', newToken);  // Save new token to localStorage
    const decodedToken = jwt_decode(newToken);  // Decode the new token
    console.log('Updated Token:', decodedToken);

    localStorage.setItem("isPremium",decodedToken.isPremium)


    // Update UI to show premium user status
    document.querySelector('.premium').innerHTML = '<p>&#x1F451; You are a Premium User &#x1F451;</p>';

    // Hide buy premium button if it exists
    const buyPremiumButton = document.getElementById('rzpbtn1');
    if (buyPremiumButton) {
        buyPremiumButton.style.display = 'none';
    }

    // Enable leaderboard button and set up click handler to redirect to leaderboard
    const leaderboardButton = document.getElementById('leaderboardButton');
    if (leaderboardButton) {
        leaderboardButton.disabled = false;
        leaderboardButton.onclick = function () {
            window.location.href = 'leaderbrd.html';
        };
    }

    // Alert user about successful payment and premium status
    alert('Payment Successfull \u20B9 \u2705 You are a Premium User Now');
};

// Event handler for buy premium button click
document.getElementById('rzpbtn1').onclick = async function (e) {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/purchase/premiumMembership`, {
            headers: { Authorization: token, price: 19900 }
        });
        console.log('Order Response:', response);

        const options = {
            key: response.data.key_id,
            order_id: response.data.order.id,
            handler: async function (response) {
                try {
                    const res = await axios.post(`http://localhost:4000/purchase/updateTransactionStatus`, {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }, { headers: { Authorization: token } });

                    console.log('Transaction Status Response:', res);
                    updateTokenAndUI(res.data.token);  // Update token and UI
                } catch (err) {
                    console.log('Error is:', err);
                }
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', async function (response) {
            try {
                await axios.post(`http://localhost:4000/purchase/updateTransactionStatus`, {
                    order_id: options.order_id,
                }, { headers: { Authorization: token } });

                console.log('Payment failed:', response);
                alert('Something went wrong');
            } catch (err) {
                console.log('Error is:', err);
            }
        });
    } catch (err) {
        console.log('Error is -> ', err);
    }
};


document.getElementById('rzpbtn1').onclick = async function (e) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/purchase/premiumMembership`, { headers: { Authorization: token, price: 19900 } });
        console.log(response);

        const options = {
            key: response.data.key_id,
            order_id: response.data.order.id,
            handler: async function (response) {
                try {
                    // console.log(response.razorpay_payment_id);
                    const res = await axios.post(`http://localhost:4000/purchase/updateTransactionStatus`,
                        {
                            order_id: options.order_id,
                            payment_id: response.razorpay_payment_id
                        }, { headers: { Authorization: token } });

                 
                    e.target.remove();
                    // document.querySelector('.premium').innerHTML = '<p>&#x1F451; You are Premium User &#x1F451;</p>';
                        
                    localStorage.setItem('token', res.data.token);
                    window.alert('\u20B9 Payment Successful \u2705');
                    window.alert("You are Premium User now!👑")
                } catch (err) {
                    console.log('Error is:', err);
                }
            }
        };

        const rzpl = new Razorpay(options);
        rzpl.open();
        e.preventDefault();

        rzpl.on('payment-failed', async function (response) {
            try {
                const res = await axios.post(`http://localhost:4000/purchase/updateTransactionStatus`, {
                    order_id: options.order_id,
                }, { headers: { Authorization: token } });

                console.log('Payment failed:', response);
                alert('Something went wrong');
            } catch (err) {
                console.log('Error is:', err);
            }
        });
    } catch (err) {
        console.log('Error is -> ', err);
    }
};




// Redirection functions
function redirectToReports() {
    window.location.href = 'reports.html';
}

function redirectToAboutUs() {
    window.location.href = 'about.html';
}

function redirectToLogout() {
    window.location.href = 'login.html';
}
