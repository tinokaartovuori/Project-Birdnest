import fetch from 'node-fetch';
import { parseString } from 'xml2js';

const droneAPI = {
  getDrones: async () => {
    try {
      // Fetching the data from the api
      let response = await fetch('https://assignments.reaktor.com/birdnest/drones', {
        method: 'GET',
      });

      // If the request was successful, parse the response as XML
      if (response.ok) {
        let xml_string = await response.text();
        return new Promise((resolve, reject) => {
          parseString(xml_string, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      }
      // If the request was not successful, throw an error
      else {
        throw new Error('Error fetching data from API');
      }
    } catch (error) {
      // If there is an error making the request or parsing the response, catch it and return an object with the error message
      console.error(error);
      return { error: error.message };
    }
  },
};

export default droneAPI;
