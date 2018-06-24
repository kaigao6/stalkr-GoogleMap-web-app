# stalkr-GoogleMap-web-app


The purpose of this web app is for people to track sightings of a certain crazy politician as he moves around the world. 
The app uses the following technologies:
- geolocation
- fetch (to make AJAX calls)
- Google maps Javascript API
- localStorage
Layout The app will basically consist of a header bar with the app title and then a Google Map that fills the remainder of the screen.
Web App Features
When the page loads, the Google Map would be loaded and fill the screen. 
Next a call to geolocation will be made. If allowed, then a marker with a GREEN letter "U" is added to user’s current position. The map will then be centered on that marker. Tapping / clicking on the "U" marker should allow user to add that location as a sighting. It will remove the "U" marker and replace it with a marker that matches the sighting markers. The current position and time need to be added to the localstorage list of sightings. The "U" marker also have a title that says "Your current position".
Then a fetch call to the server over https to retrieve a JSON file with default list of imaginary sightings for user’s stalking target. This JSON file is downloaded and then the information stored in localStorage. All JSON data is saved as a single key in localstorage
Next, loop through the localStorage list of sightings and add markers for each sighting. The sighting markers need to be a different colour than the current position marker. Tapping / clicking on a marker should show an infoWindow with the time and date of the sighting.
