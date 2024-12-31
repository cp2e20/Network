// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get the container element and both buttons
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    // Add 'active' class when the register button is clicked
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
    // Remove 'active' class when the login button is clicked
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
    // Get the login form and attach the event listener to the form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        // Prevent the default form submission
        event.preventDefault();
        // Get the value of the email and password fields
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // Replace with the actual credentials and check
        const correctEmail = 'correct@example.com'; // The correct email for login
        const correctPassword = 'correctpassword'; // The correct password for login
        if (email === correctEmail && password === correctPassword) {// If the credentials match, redirect to index.html
            window.location.href = 'index.html'; // Redirect to index.html if login is successful
        } else {// If credentials don't match, display an error message
            alert('Incorrect email or password. Please try again.');
        }
    });
});
