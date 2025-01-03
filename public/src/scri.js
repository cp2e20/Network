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

  // Toggle visibility of craftsman fields and submit user data
  const craftsmanRadio = document.getElementById("craftsman");
  const userRadio = document.getElementById("user");
  const craftsmanFields = document.getElementById("craftsman-fields");

  if (craftsmanFields) craftsmanFields.style.display = "none";

  if (craftsmanRadio && userRadio) {
    craftsmanRadio.addEventListener("change", async function () {
      craftsmanFields.style.display = "block";

      // Submit user entry to the User table when "Craftsman" is selected
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!name || !email || !password) {
        alert(
          "Please fill out Name, Email, and Password before selecting Craftsman."
        );
        return;
      }

      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "craftsman",
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("User entry created successfully!");
          console.log(data);
        } else {
          alert(data.message || "Error occurred while creating user entry.");
        }
      } catch (error) {
        console.error("Error creating user entry:", error);
      }
    });

    userRadio.addEventListener("change", function () {
      craftsmanFields.style.display = "none";
    });
  }
  document.getElementById("login-email").addEventListener("blur", async () => {
    const email = document.getElementById("login-email").value.trim();

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

  // Handle Final Registration Form Submission (Complete Craftsman Data)
  document
    .getElementById("register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const role = document.querySelector('input[name="role"]:checked').value;

      // Additional fields for Craftsman
      const specialization = document
        .getElementById("craftsman-specialization")
        .value.trim();
      const experience = document
        .getElementById("craftsman-experience")
        .value.trim();
      const bio = document.getElementById("craftsman-bio").value.trim();

      // Prepare the payload
      const payload = { name, email, password, role };
      if (role === "craftsman") {
        if (!specialization || !experience || !bio) {
          alert("Please fill out all Craftsman-specific fields.");
          return;
        }
        payload.specialization = specialization;
        payload.experience = experience;
        payload.bio = bio;
      }

      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful!");
        } else {
          alert(data.message || "Error occurred during registration.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    });
});
