A solution to Reaktor Group's job application

Here is the Web Application running: https://the-project-birdnest.onrender.com/

Note: If application is not used for a while it goes to idle. All the fiels are not showing correct values (Shows like Undefined and NaN and such).

The goal of Project Birdnest is to build and deploy a web application that lists all the pilots who have recently violated the no-drone zone (NDZ) around a Monadikuikka nest at a local lake. The web application should retrieve data on the positions and serial numbers of drones in the area from the monitoring equipment endpoint at "assignments.reaktor.com/birdnest/drones" and use this data to identify violations of the NDZ. It should then use the serial numbers of the violating drones to retrieve the names, email addresses, and phone numbers of the pilots from the national drone registry endpoint at "assignments.reaktor.com/birdnest/pilots/:serialNumber" and display this information to the user. The pilot information should be persisted for 10 minutes after the last sighting of the violating drone. The web application should also display the closest confirmed distance of the violating drone to the nest. The user should not have to manually refresh the view to see up-to-date information, and the application should immediately show the information from the last 10 minutes to anyone opening it.

My implementation of the Web Application was built using a Node.js server with the Express framework serving a static HTML + CSS + JavaScript page for the user. Initially I was about to implement the data storage using Firestore but descided to use a simpler solution instead.

Here are a few areas in which the implementation of the web application could be improved:

- Enhancing the user interface and adding a map visualization of the drone positions and the no-drone zone would improve the usability and functionality of the application.
- Optimizing the use of HTTP requests and possibly implementing caching or data persistence techniques would improve the performance of the web application.
- Incorporating a more robust database, such as Firebase, would provide more reliable data storage and management capabilities.
- Adding additional functionality to the front-end, such as the ability to filter pilot information or display the violating drone positions on a map, would enhance the user experience.
- Implementing user authentication and authorization would ensure that only authorized users have access to the sensitive information displayed on the web application.
- Adding error handling to the web application would ensure that it is robust and can handle unexpected errors gracefully.
- Implementing unit and integration tests would ensure that the web application is working as expected and would catch any potential bugs or issues before deployment.
