import responseUtils from "../utils/responseUtils.js"; // Import the response utility functions
import pilotAPI from "../utils/pilotAPI.js"; // Import the pilot API utility functions

const controllerFunctions = {
  // This function sends a request to the pilotAPI to get pilot data for the specified serial number
  // If the request is successful, it sends the data back to the client in the response
  getPilot: async (req, res) => {
    // Getting the serial number from the request parameters
    let serial_number = req.params.serial_number;
    // Getting data from the API
    let data = await pilotAPI.getPilot(serial_number);
    // Responding with the data
    return responseUtils.sendJson(res, data, 200);
  },
};

export default controllerFunctions;
