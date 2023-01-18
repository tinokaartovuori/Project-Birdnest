import express from 'express';
import controllerFunctions from '../controllers/pilotData.controller.js';

const router = express.Router();

router.get('/get_pilot/:serial_number', controllerFunctions.getPilot);

export default router;
