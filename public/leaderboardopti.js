document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const leaderboardButton = document.getElementById('leaderboardButton');
    const buyPremiumButton = document.getElementById('rzpbtn1');

    console.log('Leaderboard Button:', leaderboardButton);  
    const enableLeaderboardButton = () => {
        if (leaderboardButton) {
            leaderboardButton.classList.remove('disabled');
            leaderboardButton.onclick = function () {
                window.location.href = 'leaderbrd.html';
            };
            console.log('Leaderboard button enabled');
        } else {
            console.error('Leaderboard button not found');
        }
    };

    const disableLeaderboardButton = () => {
        if (leaderboardButton) {
            leaderboardButton.classList.add('disabled');
            leaderboardButton.onclick = function () {
                alert('You need to be a premium user to access the leaderboard.');
            };
            console.log('Leaderboard button disabled');
        } else {
            console.error('Leaderboard button not found');
        }
    };

    // Check the premium status of the user
    const checkPremiumStatus = async () => {
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                console.log('Decoded Token:', decodedToken);

                if (decodedToken && decodedToken.isPremium) {
                    // document.querySelector('.premium').innerHTML = '<p><h4>&#x1F451; You are a Premium User &#x1F451;<h4></p>';
                    if (buyPremiumButton) {
                        buyPremiumButton.style.display = 'none';
                    }
                    enableLeaderboardButton();
                } else {
                    console.log('User is not premium');
                    disableLeaderboardButton();
                }
            } catch (err) {
                console.error('Error decoding token:', err);
                disableLeaderboardButton();
            }
        } else {
            console.log('No token found');
            disableLeaderboardButton();
        }
    };

    console.log('Calling checkPremiumStatus');
    checkPremiumStatus();
});

// Function to redirect to leaderboard
function redirectToLeaderboard() {
    window.location.href = 'leaderbrd.html';
}

