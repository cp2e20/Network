// Get the user ID from the URL (e.g., ?userId=123)
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

if (!userId) {
  document.getElementById('profile').innerHTML = '<p>Invalid or missing user ID</p>';
} else {
  // Fetch craftsman data by user ID
  fetch(`/api/craftsman/user/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch craftsman data');
      }
      return response.json();
    })
    .then((craftsman) => {
      // Populate the HTML with craftsman data
      document.getElementById('name').textContent = craftsman.name;
      document.getElementById('email').textContent = craftsman.email;
      document.getElementById('skill').textContent = craftsman.skill;
      document.getElementById('experience').textContent = `${craftsman.experience} years`;
      document.getElementById('description').textContent = craftsman.description;
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById('profile').innerHTML = '<p>Failed to load profile data.</p>';
    });
}
