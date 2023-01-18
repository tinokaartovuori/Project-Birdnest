// This module is intended to be a flexible interface for interacting with a database.
// It was originally designed to work with Firebase, but it has been simplified to be more generic.
// It can be easily adapted to work with any database management system.

import fs from "fs";

const DRONE_VIOLATIONS_FILE_PATH = "./server/data/droneViolations.json";
const CLOSEST_VIOLATION_FILE_PATH = "./server/data/closestViolation.json";

// Function to set the closest violation data to the closestViolation.json file
export async function setClosestViolation(data) {
  // Set the file data to the closest_violation parameter
  let new_data = {
    distance: data.distance || "",
    serial: data.serial || "",
    timestamp: data.timestamp || "",
    pilotId: data.pilotId || "",
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phoneNumber: data.phoneNumber || "",
    email: data.email || "",
  };
  const fileData = new_data;
  // Write the data to the file
  fs.writeFileSync(CLOSEST_VIOLATION_FILE_PATH, JSON.stringify(fileData));
}

// Function to get the closest violation data from the closestViolation.json file
export async function getClosestViolation() {
  // Read the data from the file
  const fileData = fs.readFileSync(CLOSEST_VIOLATION_FILE_PATH);
  // Parse the file data from JSON to a JavaScript object
  const docData = JSON.parse(fileData);
  return docData;
}

// Function to add a new drone violation to the droneViolations.json file
export async function addDroneViolation(data) {
  // Reading all the violations from the file
  let violations = await getDroneViolations();
  // Adding new violation
  violations[data.pilotId] = data;
  // Write the data to the file
  setAllDroneViolations(violations);
}

// Function to set all drone violation data to the droneViolations.json file
export async function setAllDroneViolations(data) {
  // Write the data to the file
  fs.writeFileSync(DRONE_VIOLATIONS_FILE_PATH, JSON.stringify(data));
}

// Function to get all drone violation data from the droneViolations.json file
export async function getDroneViolations() {
  // Read the data from the file
  const fileData = fs.readFileSync(DRONE_VIOLATIONS_FILE_PATH);
  // Parse the file data from JSON to a JavaScript object
  const docData = JSON.parse(fileData);
  return docData;
}

// Function to remove a drone violation from the droneViolations.json file
export async function removeDroneViolation(pilotId) {
  let violations = await getDroneViolations();
  // Delete the violation with the specified pilotId
  delete violations[pilotId];
  setAllDroneViolations(violations);
}
