import http from "http"; // Import the http module
import app from "./app.js"; // Import the app.js module

const server = http.createServer(app); // Create an HTTP server using the app as the request handler

const PORT = process.env.PORT || 3001; // Get the port from the environment variables or use 3001 as the default

// Start the server and listen for incoming connections on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
