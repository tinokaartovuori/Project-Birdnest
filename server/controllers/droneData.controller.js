import responseUtils from "../utils/responseUtils.js";
import droneAPI from "../utils/droneAPI.js";

const controllerFunctions = {
  // This function sends a request to the droneAPI to get a list of drones
  // If the request is successful, it sends the data back to the client in the response
  // If there is an error, it sends an appropriate error message back to the client
  getDrones: async (req, res) => {
    try {
      // Getting data from the API
      let data = await droneAPI.getDrones();
      // Sending the data back to the client in the response
      return responseUtils.sendJson(res, data, 200);
    } catch (error) {
      // If there is an error, send a 404 error message back to the client
      console.error(error);
      return responseUtils.notFound();
    }
  },
};

export default controllerFunctions;
