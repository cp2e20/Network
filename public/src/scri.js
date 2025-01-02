document.addEventListener("DOMContentLoaded", function () {
  // Handle Login Form Submission
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
      }

      try {
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          window.location.href = "/dashboard.html"; // Redirect after successful login
        } else {
          alert(data.message || "Login failed.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again.");
      }
    });
  }

  // Toggle Sign In / Sign Up
  const signUpButton = document.getElementById("sign-up");
  const signInButton = document.getElementById("sign-in");
  const container = document.getElementById("container");

  if (signUpButton && signInButton) {
    signUpButton.addEventListener("click", function () {
      console.log("Sign Up button clicked.");
      container.classList.add("active"); // Show Sign Up form
    });

    signInButton.addEventListener("click", function () {
      console.log("Sign In button clicked.");
      container.classList.remove("active"); // Show Sign In form
    });
  }

  // Handle Registration Form Submission
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document
        .getElementById("register-password")
        .value.trim();
      const role = document.querySelector('input[name="role"]:checked').value;

      const payload = { name, email, password, role };

      if (role === "craftsman") {
        payload.specialization = document
          .getElementById("craftsman-specialization")
          .value.trim();
        payload.experience = document
          .getElementById("craftsman-experience")
          .value.trim();
        payload.bio = document.getElementById("craftsman-bio").value.trim();
      }

      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful!");
          container.classList.remove("active"); // Redirect to Sign In form
        } else {
          alert(data.error || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during registration. Please try again.");
      }
    });
  }

  // Toggle visibility of craftsman fields
  const craftsmanRadio = document.getElementById("craftsman");
  const userRadio = document.getElementById("user");
  const craftsmanFields = document.getElementById("craftsman-fields");

  if (craftsmanFields) craftsmanFields.style.display = "none"; // Hide initially

  if (craftsmanRadio && userRadio) {
    craftsmanRadio.addEventListener("change", function () {
      craftsmanFields.style.display = "block";
    });

    userRadio.addEventListener("change", function () {
      craftsmanFields.style.display = "none";
    });
  }
});
