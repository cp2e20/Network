document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const signUpButton = document.getElementById("sign-up");
  const signInButton = document.getElementById("sign-in");
  const container = document.getElementById("container");
  const craftsmanRadio = document.getElementById("craftsman");
  const userRadio = document.getElementById("user");
  const craftsmanFields = document.getElementById("craftsman-fields");

  // Hide craftsman fields initially
  if (craftsmanFields) craftsmanFields.style.display = "none";

  // Toggle craftsman fields visibility
  if (craftsmanRadio && userRadio) {
    craftsmanRadio.addEventListener("change", () => {
      craftsmanFields.style.display = "block";
    });

    userRadio.addEventListener("change", () => {
      craftsmanFields.style.display = "none";
    });
  }

  // Handle Login Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
      }

      try {
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (response.ok) {
          alert("Login successful!");
          console.log("Logged in user:", result);
        } else {
          alert(result.message || "Login failed.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }

  // Toggle Sign In / Sign Up
  if (signUpButton && signInButton) {
    signUpButton.addEventListener("click", () => {
      container.classList.add("active");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("active");
    });
  }

  // Handle Registration Form Submission
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

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
        const response = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message);
        } else {
          const error = await response.json();
          alert(`Error: ${error.error || "Something went wrong"}`);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }
});
