document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent default form submission
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert(data.message);
          // Redirect if login is successful
          window.location.href = '/dashboard.html';
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
      }
    });
  });
  