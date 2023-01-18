import express from 'express';
import controllerFunctions from '../controllers/violationData.controller.js';

const router = express.Router();

router.get('/get_closest_violation', controllerFunctions.getClosestViolation);
router.get('/get_drone_violations', controllerFunctions.getDroneViolations);

export default router;
