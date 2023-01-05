import express from "express";
import path from "path";
import { config } from "dotenv";
import droneDataRoute from "./routes/droneData.route.js";
import pilotDataRoute from "./routes/pilotData.route.js";
import violationDataRoute from "./routes/violationData.route.js";
import { fileURLToPath } from "url";
import droneControl from "./droneControl.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Adding all the routes here
app.use("/api/drone_data", droneDataRoute);
app.use("/api/pilot_data", pilotDataRoute);
app.use("/api/violation_data", violationDataRoute);

// Load environment variables
config();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Error Handling for bad url request
app.use((req, res, next) => {
  res.status(404).json({
    error: "Bad Url Request",
  });
});

// Starting the main app (Interval)
droneControl.startInterval();

export default app;
