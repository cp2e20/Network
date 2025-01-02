document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  const categoryNameElement = document.getElementById("category-name");
  const craftsmenListElement = document.getElementById("craftsmen-list");

  categoryNameElement.textContent = category;

  try {
    const response = await fetch(`/categories/${category}`);
    const craftsmen = await response.json();

    if (craftsmen.length === 0) {
      craftsmenListElement.innerHTML = "<p>No craftsmen found in this category.</p>";
      return;
    }

    craftsmenListElement.innerHTML = craftsmen
      .map(
        (craftsman) => `
          <div class="craftsman-card">
            <h3>${craftsman.userId.name}</h3>
            <p><strong>Experience:</strong> ${craftsman.experience} years</p>
            <p><strong>Rating:</strong> ${craftsman.rating}/5</p>
            <p>${craftsman.description}</p>
          </div>
        `
      )
      .join("");
  } catch (error) {
    craftsmenListElement.innerHTML = "<p>Error loading craftsmen. Please try again later.</p>";
    console.error("Error fetching craftsmen:", error);
  }
});
