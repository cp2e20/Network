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
  // Attach event listener to the "Sign Up" form
  document
    .getElementById("register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent the default form submission

      // Get input values
      const name = document.getElementById("name").value;
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      const role = document.querySelector('input[name="role"]:checked').value;

      // Additional fields for craftsman (optional)
      const specialization =
        document.getElementById("craftsman-specialization").value || null;
      const experience =
        document.getElementById("craftsman-experience").value || null;
      const bio = document.getElementById("craftsman-bio").value || null;

      try {
        // Send data to the server
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
            specialization,
            experience,
            bio,
          }),
        });

        // Handle response
        if (response.ok) {
          const data = await response.json();
          alert("Registration successful! Welcome, " + data.name);
          console.log(data);
        } else {
          const error = await response.json();
          alert("Error: " + error.error);
        }
      } catch (err) {
        console.error("Error during registration:", err);
        alert("Something went wrong. Please try again later.");
      }
    });

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
