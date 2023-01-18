import responseUtils from '../utils/responseUtils.js';
import * as firebaseUtils from '../utils/dataUtils.js';

const controllerFunctions = {
  // This function gets a serial number from the request parameters and sends a request to the pilotAPI to get the corresponding pilot data
  // If the request is successful, it sends the data back to the client in the response
  // If there is an error, it sends an appropriate error message back to the client
  getClosestViolation: async (req, res) => {
    try {
      let closest_violation = await firebaseUtils.getClosestViolation();
      return responseUtils.sendJson(res, closest_violation, 200);
    } catch (error) {
      // If there is an error, send a 404 error message back to the client
      console.error(error);
      return responseUtils.notFound(res);
    }
  },
  getDroneViolations: async (req, res) => {
    try {
      let violations = await firebaseUtils.getDroneViolations();
      return responseUtils.sendJson(res, violations, 200);
    } catch (error) {
      // If there is an error, send a 404 error message back to the client
      console.error(error);
      return responseUtils.notFound(res);
    }
  },
};

export default controllerFunctions;
