import fs from "fs";

// This module is intended to be a flexible interface for interacting with a database.
// It was originally designed to work with Firebase, but it has been simplified to be more generic.
// It can be easily adapted to work with any database management system.

// Function to set the closest violation data to the closestViolation.json file
export async function setClosestViolation(closest_violation) {
  // Define the file path for the closestViolation.json file
  const filePath = "./server/data/closestViolation.json";
  // Set the file data to the closest_violation parameter
  const fileData = closest_violation;
  // Write the data to the file
  fs.writeFileSync(filePath, JSON.stringify(fileData));
}

// Function to get the closest violation data from the closestViolation.json file
export async function getClosestViolation() {
  // Define the file path for the closestViolation.json file
  const filePath = "./server/data/closestViolation.json";
  // Read the data from the file
  const fileData = fs.readFileSync(filePath);
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
  // Define the file path for the droneViolations.json file
  const filePath = "./server/data/droneViolations.json";
  // Write the data to the file
  fs.writeFileSync(filePath, JSON.stringify(data));
}

// Function to get all drone violation data from the droneViolations.json file
export async function getDroneViolations() {
  // Define the file path for the droneViolations.json file
  const filePath = "./server/data/droneViolations.json";
  // Read the data from the file
  const fileData = fs.readFileSync(filePath);
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
