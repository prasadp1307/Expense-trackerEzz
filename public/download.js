   // Function to redirect to reports page, only if premium
   function redirectToReports() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token not found. User not authenticated.');
        return;
    }

    axios.get('http://localhost:4000/user/checkPremium', {
        headers: { Authorization: `Bearer ${token}` }
    }).then((premiumResponse) => {
        if (premiumResponse.data.isPremium) {
            window.location.href = '/reports.html'; 
        } else {
            alert('You need to be a premium user to access the reports.'); 
        }
    }).catch((err) => {
        console.error('Error checking premium status:', err);
        
        // Handle error checking premium status
        alert('Error checking premium status. Please try again later.');
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const reportButton = document.getElementById('reportbutton');
    const buyPremiumButton = document.getElementById('rzpbtn1');

    console.log('Report Button:', reportButton);

    const enableReportButton = () => {
        if (reportButton) {
            reportButton.classList.remove('disabled');
            reportButton.onclick = function () {
                window.location.href = 'reports.html';
            };
            console.log('Report button enabled');
        } else {
            console.error('Report button not found');
        }
    };

    const disableReportButton = () => {
        if (reportButton) {
            reportButton.classList.add('disabled');
            reportButton.onclick = function () {
                alert('You need to be a premium user to access the reports.');
            };
            console.log('Report button disabled');
        } else {
            console.error('Report button not found');
        }
    };

    // Function to check the premium status of the user
    const checkPremiumStatus = async () => {
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                console.log('Decoded Token:', decodedToken);

                if (decodedToken && decodedToken.isPremium) {
                    if (buyPremiumButton) {
                        buyPremiumButton.style.display = 'none';
                    }
                    enableReportButton();
                } else {
                    console.log('User is not premium');
                    disableReportButton();
                }
            } catch (err) {
                console.error('Error decoding token:', err);
                disableReportButton();
            }
        } else {
            console.log('No token found');
            disableReportButton();
        }
    };

    console.log('Calling checkPremiumStatus for reports button');
    checkPremiumStatus();
});

// Function to redirect to reports
function redirectToReports() {
    window.location.href = 'reports.html';
}
