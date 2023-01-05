import fetch from "node-fetch";

// This object contains a single function for fetching pilot data from a remote API
const pilotAPI = {
  // This function makes a GET request to the remote API and returns the JSON response
  // It accepts a serial number as a parameter and returns an object containing the pilot data
  // If there is an error making the request or parsing the response, it returns an object with an error message
  getPilot: async (serial_number) => {
    try {
      // Make the GET request to the API
      let response = await fetch(
        "https://assignments.reaktor.com/birdnest/pilots/" + serial_number,
        {
          method: "GET",
        }
      );

      // If the request was successful, parse the response as JSON and return it
      if (response.ok) {
        let json = await response.json();
        return json;
      }
      // If the request was not successful, throw an error
      else {
        throw new Error("Invalid serial number");
      }
    } catch (error) {
      // If there is an error making the request or parsing the response, catch it and return an object with the error message
      console.error(error);
      return { error: error.message };
    }
  },
};

// Export the object so it can be used in other modules
export default pilotAPI;
