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

          // Redirect based on role
          if (data.role === "craftsman") {
            window.location.href = "./public/Cdashboard.html";
          } else {
            window.location.href = "./public/dashboard.html";
          }
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

  // Handle Role Selection for Craftsman and User
  const craftsmanRadio = document.getElementById("craftsman");
  const userRadio = document.getElementById("user");
  const craftsmanFields = document.getElementById("craftsman-fields");

  if (craftsmanFields) craftsmanFields.style.display = "none";

  if (craftsmanRadio && userRadio) {
    craftsmanRadio.addEventListener("change", function () {
      craftsmanFields.style.display = "block";
    });

    userRadio.addEventListener("change", function () {
      craftsmanFields.style.display = "none";
    });
  }

  // Handle Email Validation
  const loginEmailInput = document.getElementById("login-email");
  if (loginEmailInput) {
    loginEmailInput.addEventListener("blur", async () => {
      const email = loginEmailInput.value.trim();

      try {
        const response = await fetch("/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data.message);
        } else {
          alert(data.message || "This email is already registered.");
        }
      } catch (error) {
        console.error("Error checking email availability:", error);
      }
    });
  }

  // Handle Final Registration Form Submission
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const role = document.querySelector('input[name="role"]:checked').value;

      // Base validation for all users
      if (!name || !email || !password || !role) {
        alert("All fields are required.");
        return;
      }

      // Create payload for user
      const payload0 = { name, email, password, role };

      // Handle Craftsman-specific fields if the role is "craftsman"
      let payload = { ...payload0 }; // Initialize craftsman payload based on user payload
      
      if (role === "craftsman") {
        const specialization = document
          .getElementById("craftsman-specialization")
          .value.trim();
        const experience = document
          .getElementById("craftsman-experience")
          .value.trim();
        const bio = document.getElementById("craftsman-bio").value.trim();

       

        // Add craftsman-specific fields to the payload
        payload = {
          ...payload0,
          specialization,
          experience,
          bio,
        };
      }

      try {
        // Send the appropriate payload based on the role
        const response = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Send either user-only or user + craftsman fields
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
        } else {
          alert(data.message || "Registration failed.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    });
  }
});
