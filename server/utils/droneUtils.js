import droneAPI from "./droneAPI.js";
import pilotAPI from "./pilotAPI.js";
import * as dataUtils from "./dataUtils.js";

// Some constants for the task
const ORIGIN = { x: 250000, y: 250000 };
const DISTANCE = 100000;
const EXPIRATION_DURATION_MS = 10 * 60 * 1000;

// This is the main process that is run in the background interval
export async function runDroneProcess() {
  let drones = await getDronesData();
  await handleViolations(drones);
}

// Gets drone data from the API and converts it to usable format
async function getDronesData() {
  // Fetch all the drones
  try {
    const raw_drones_json = await droneAPI.getDrones();
    return getDronesFormatted(raw_drones_json);
  } catch (error) {
    // Handle the error here
    console.error(error);
    return {};
  }
}

// Handels all violation related actions
async function handleViolations(drones) {
  await removeOldViolations(); // Older than 10 minutes
  await updateViolations(drones); //
}

// Converts drones into usable format, simplifying and adding additional information
async function getDronesFormatted(json) {
  let drones = await simplifyDrones(json); // Remove unnecessary things
  let drones_with_timestamps = addTimestamps(drones); // Adding timestamps
  let formated_drones = await addPilotData(drones_with_timestamps);
  return formated_drones; // Add pilot data to the drones
}

// Only takes information needed from raw json data
async function simplifyDrones(drones_json) {
  // Only take the serial and coordinates of the drone
  try {
    const drones = drones_json.report.capture[0].drone;
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
}

// Fetches and adds pilot data to the simplified drone data
async function addPilotData(drones) {
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
}

// Updates the violation information to "the database"
async function updateViolations(drones) {
  const drones_violating = await getDronesInCircle(
    drones,
    ORIGIN.x,
    ORIGIN.y,
    DISTANCE
  );
  // Get the data of the drone that was closest to the nest
  let current_closest = await dataUtils.getClosestViolation();

  for (let drone of drones_violating) {
    // Add new violation to "the database".
    await dataUtils.addDroneViolation(drone);
    console.log("Adding new violation " + drone.pilotId);

    // Check if any of the drones are closest ever to the nest
    if (current_closest.distance > drone.distance) {
      console.log("New closest violation " + drone.pilotId);
      dataUtils.setClosestViolation(drone);
    }
  }
  return;
}

// Removes violations older than 10 minutes from "the database"
async function removeOldViolations() {
  // Get all the drones that violated the rule
  let currently_violated_drones = await dataUtils.getDroneViolations();

  // Keep cases older than 10 minutes
  let old_violations = filterOldViolations(
    currently_violated_drones,
    EXPIRATION_DURATION_MS
  );

  // Remove cases older than 10 minutes from "the database"
  if (old_violations.length <= 0) return;
  for (const pilotId in old_violations) {
    console.log("Removing old violation " + pilotId);
    await dataUtils.removeDroneViolation(pilotId);
    return;
  }
}

// Gets drones in circle and adds distance to the origin to the drone data
async function getDronesInCircle(drones, x, y, distance) {
  return drones
    .map((drone) => {
      const dist = distance2D(x, y, drone.x, drone.y);
      return { ...drone, distance: dist };
    })
    .filter((drone) => drone.distance <= distance);
}

// Adds timestamps to drones
function addTimestamps(drones) {
  const createTimestamp = () => {
    return new Date().toISOString();
  };

  let drones_with_timestamps = [];
  for (const drone of drones) {
    drones_with_timestamps.push({ ...drone, timestamp: createTimestamp() });
  }
  return drones_with_timestamps;
}

// Returns drones with timestamps too old
function filterOldViolations(data, expiration_duration) {
  const currentTime = new Date();
  const tenMinutesAgo = new Date(currentTime - expiration_duration);
  const filteredData = {};

  for (const key of Object.keys(data)) {
    const timestamp = new Date(data[key].timestamp);
    if (timestamp < tenMinutesAgo) {
      filteredData[key] = data[key];
    }
  }

  return filteredData;
}

// Returns a distance between 2 points in 2D
function distance2D(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
