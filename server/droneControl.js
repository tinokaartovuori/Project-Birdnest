import droneAPI from "./utils/droneAPI.js";
import pilotAPI from "./utils/pilotAPI.js";
import * as dataUtils from "./utils/dataUtils.js";

const droneControl = {
  // This function starts an interval that calls the mainInterval function every 2 seconds
  startInterval: () => {
    // This is set to every 10 seconds to reduce amount of requests
    setInterval(droneControl.mainInterval, 2000);
  },
  // This function fetches new drone data and performs some other logic
  mainInterval: async () => {
    // Fetch all the drones
    let drones = await droneAPI.getDrones();
    // Simplify drone data
    let drones_simplified = droneControl.simplifyDrones(drones);

    // Origin where the birdnest is located
    const origin = { x: 250000, y: 250000 };

    // Filter out drones that are not in the restricted area
    let drones_in_area = droneControl.getDronesInRestrictedArea(
      drones_simplified,
      origin.x,
      origin.y,
      100000
    );

    // Get pilots for every drone that violated the rule (if available)
    let drones_with_pilot = await droneControl.addPilotData(drones_in_area);

    // Get the data of the drone that was closest to the nest
    let closest = await dataUtils.getClosestViolation();

    for (let drone of drones_with_pilot) {
      // Add new violation to the database.
      await dataUtils.addDroneViolation(drone);
      console.log("Adding new violation " + drone.pilotId);

      // Check if any of the drones are closest ever to the nest
      if (closest.distance > drone.distance) {
        console.log("New closest violation " + drone.pilotId);
        dataUtils.setClosestViolation({
          distance: drone.distance || "",
          serial: drone.serial || "",
          timestamp: drone.timestamp || "",
          pilotId: drone.pilotId || "",
          firstName: drone.firstName || "",
          lastName: drone.lastName || "",
          phoneNumber: drone.phoneNumber || "",
          email: drone.email || "",
        });
      }
    }

    // Get all the drones that violated the rule
    let currently_violated_drones = await dataUtils.getDroneViolations();
    // Keep cases older than 10 minutes
    let old_violations = droneControl.filterOldViolations(
      currently_violated_drones
    );

    // Remove cases older than 10 minutes from the database
    if (old_violations.length <= 0) return;
    for (const pilotId in old_violations) {
      console.log("Removing old violation " + pilotId);
      await dataUtils.removeDroneViolation(pilotId);
    }

    // It would be advisable to implement long polling in this location
    // to provide instant updates to the client. However, for the sake of simplicity,
    // it is the client's responsibility to fetch data as desired.
  },
  simplifyDrones: (dronesData) => {
    try {
      const drones = dronesData.report.capture[0].drone;
      return drones.map((drone) => {
        return {
          serial: drone.serialNumber[0],
          x: drone.positionX[0],
          y: drone.positionY[0],
        };
      });
    } catch (error) {
      // Handle the error here
      console.error(error);
      return [];
    }
  },
  getDronesInRestrictedArea: (drones, x, y, distance) => {
    const createTimestamp = () => {
      return new Date().toISOString();
    };

    return drones
      .map((drone) => {
        const dist = droneControl.distance(x, y, drone.x, drone.y);
        return { ...drone, distance: dist, timestamp: createTimestamp() };
      })
      .filter((drone) => drone.distance <= distance);
  },
  distance: (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },
  addPilotData: async (drones) => {
    let drones_with_pilot = [];
    for (const drone of drones) {
      // Fetch the pilot data for the current drone
      const pilotData = await pilotAPI.getPilot(drone.serial);

      // If the pilot data was successfully fetched, add it to the drone object and push it to the modifiedDrones array
      if (!pilotData.error) {
        drones_with_pilot.push({
          ...drone,
          pilotId: pilotData.pilotId,
          firstName: pilotData.firstName,
          lastName: pilotData.lastName,
          phoneNumber: pilotData.phoneNumber,
          email: pilotData.email,
        });
      }
      // If there was an error fetching the pilot data, push the original drone object to the modifiedDrones array
      else {
        drones_with_pilot.push({
          ...drone,
          pilotId: "Unknown",
          firstName: "Unknown",
          lastName: "Unknown",
          phoneNumber: "Unknown",
          email: "Unknown",
        });
      }
    }
    return drones_with_pilot;
  },
  removeOldViolations: async (drones) => {
    for (const drone of drones) {
      // Fetch the pilot data for the current drone
      const pilotData = await pilotAPI.getPilot(drone.serial);

      // If the pilot data was successfully fetched, add it to the drone object and push it to the modifiedDrones array
      if (!pilotData.error) {
        drones_with_pilot.push({ ...drone, pilot: pilotData });
      }
      // If there was an error fetching the pilot data, push the original drone object to the modifiedDrones array
      else {
        drones_with_pilot.push({ ...drone, pilot: null });
      }
    }
    return drones_with_pilot;
  },
  filterOldViolations: (data) => {
    const currentTime = new Date();
    const tenMinutesAgo = new Date(currentTime - 10 * 60 * 1000);
    const filteredData = {};

    for (const key of Object.keys(data)) {
      const timestamp = new Date(data[key].timestamp);
      if (timestamp < tenMinutesAgo) {
        filteredData[key] = data[key];
      }
    }

    return filteredData;
  },
};

export default droneControl;
