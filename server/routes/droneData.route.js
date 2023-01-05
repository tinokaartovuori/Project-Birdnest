import express from "express";
import controllerFunctions from "../controllers/droneData.controller.js";

const router = express.Router();

router.get("/get_drones", controllerFunctions.getDrones);

export default router;
