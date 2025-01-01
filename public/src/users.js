document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const users = await response.json();
      const userTable = document.getElementById("user-table");
  
      users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.password}</td>
          <td>${user.role}</td>
          <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        `;
        userTable.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  });
  