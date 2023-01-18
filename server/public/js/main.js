const BASE_URL = /* 'http://localhost:3001'; */
const BASE_URL = 'https://the-project-birdnest.onrender.com'

function updateViolationsTable() {
  // Make a GET request to the API endpoint
  fetch(BASE_URL + '/api/violation_data/get_drone_violations')
    .then((response) => response.json())
    .then((data) => {
      let violations = data;
      // Clear the current contents of the table
      const tableBody = document.querySelector('#table-body-violations');
      tableBody.innerHTML = '';

      // Sort the violations by timestamp
      const sortedViolations = Object.entries(violations).sort((a, b) => {
        const dateA = new Date(a[1].timestamp);
        const dateB = new Date(b[1].timestamp);
        return dateB - dateA;
      });

      // Add the new data to the table
      sortedViolations.forEach((data) => {
        const row = document.createElement('tr');
        const date = new Date(data[1].timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        row.innerHTML = `
        <td>${hours}:${minutes}:${seconds}</td>
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
  fetch(BASE_URL + '/api/violation_data/get_closest_violation')
    .then((response) => response.json())
    .then((data) => {
      let violation = data;
      // Clear the current contents of the table
      const tableBody1 = document.querySelector('#table-body-closest1');
      const tableBody2 = document.querySelector('#table-body-closest2');
      const date = new Date(violation.timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      tableBody1.innerHTML = `
      <tr>
        <td>${violation.firstName} ${violation.lastName}</td>
        <td>${violation.phoneNumber}</td>
        <td>${violation.email}</td>
      </tr>
      `;

      tableBody2.innerHTML = `
      <tr>
        <td>${day}/${month}/${year}</td>
        <td>${hours}:${minutes}:${seconds}</td>
        <td>${Math.round(violation.distance / 1000)}m</td>
      </tr>
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
