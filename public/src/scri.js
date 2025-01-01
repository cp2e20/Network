document.addEventListener("DOMContentLoaded", function () {
  // Existing login form handling
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        window.location.href = "/dashboard.html";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  });

  // Toggle functionality for Sign In and Sign Up
  const signUpButton = document.getElementById("sign-up");
  const signInButton = document.getElementById("sign-in");
  const container = document.getElementById("container");

  signUpButton.addEventListener("click", function () {
    container.classList.add("active"); // Add 'active' class to container
  });

  signInButton.addEventListener("click", function () {
    container.classList.remove("active"); // Remove 'active' class from container
  });
});
document
  .getElementById("register-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.querySelector('input[name="role"]:checked').value; // Get selected role

    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (response.ok) {
      alert("Registration successful!");
    } else {
      const error = await response.json();
      alert(`Error: ${error.error || "Something went wrong"}`);
    }
  });

