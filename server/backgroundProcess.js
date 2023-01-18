import { runDroneProcess } from './utils/droneUtils.js';

const backgroundProcess = {
  // This function starts an interval that calls the mainInterval function every 2 seconds
  startInterval: () => {
    // This is set to every 2 seconds to reduce amount of requests
    setInterval(mainInterval, 2000);
  },
};

// This function fetches new drone data and performs some other logic
async function mainInterval() {
  await runDroneProcess();
}

export default backgroundProcess;
