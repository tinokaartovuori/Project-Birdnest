function updateViolationsTable() {
  // Make a GET request to the API endpoint
  fetch(
    "https://the-project-birdnest.onrender.com/api/violation_data/get_drone_violations"
  )
    .then((response) => response.json())
    .then((data) => {
      let violations = data;
      // Clear the current contents of the table
      const tableBody = document.querySelector("#table-body-violations");
      tableBody.innerHTML = "";

      // Sort the violations by timestamp
      const sortedViolations = Object.entries(violations).sort((a, b) => {
        const dateA = new Date(a[1].timestamp);
        const dateB = new Date(b[1].timestamp);
        return dateB - dateA;
      });

      // Add the new data to the table
      sortedViolations.forEach((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${data[1].firstName} ${data[1].lastName}</td>
        <td>${data[1].phoneNumber}</td>
        <td>${data[1].email}</td>
      `;
        tableBody.appendChild(row);
      });
    });
}

function updateClosestViolation() {
  // Make a GET request to the API endpoint
  fetch(
    "https://the-project-birdnest.onrender.com/api/violation_data/get_closest_violation"
  )
    .then((response) => response.json())
    .then((data) => {
      let violation = data;
      // Clear the current contents of the table
      const tableBody = document.querySelector("#table-body-closest");
      tableBody.innerHTML = `
        <td>${violation.firstName} ${violation.lastName}</td>
        <td>${violation.phoneNumber}</td>
        <td>${violation.email}</td>
        <td>${Math.round(violation.distance / 1000)}m</td>
      `;
    });
}

function updateData() {
  updateViolationsTable();
  updateClosestViolation();
}

// First update on the start
updateData();
// Update the data every 2 seconds
setInterval(updateData, 2000);
