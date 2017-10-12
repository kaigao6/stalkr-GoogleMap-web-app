/*****************************************************************
File: maps.js saved in edumedia.ca
Author: Kai Gao
Description: The purpose of the app is for people to track sightings of a certain crazy politician as he moves around the world. 
Here is the sequence of logic for the app
- load google map callback
- geolocation
- center map
- add U marker
- add U marker click listener -> remove, create new marker(a standard one, now becomes a sighting), add position plus timestamp to localStorage
- fetch json
-put json to localStorage
- add markers (loop through the array)(all marker will have click listeners)
- add markers click listeners -> show infoWindow with time and date(coming from timestamp)

Version: 0.0.1
Updated: Feb 3, 2017

*****************************************************************/
//Declarations
let map;

function init() {
    //called by the Google Map script callback
    //create the map
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 5.34967,
            lng: -5.7569
        },
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    //make the geolocation call to find the current location
    if (navigator.geolocation) {
        //code goes here to find position
        let to = 1000 * 30; //1000 times 30 = 30 seconds
        let max = 1000 * 60 * 60; //1000 * 60 * 60 = 1 hour
        var params = {
            enableHighAccuracy: false,
            timeout: to,
            maximumAge: max
        };
        
        navigator.geolocation.getCurrentPosition(positionSuccess, positionError, params);
    } else {
        //browser does not support geolocation api
        alert("Sorry, but your browser does not support location based awesomeness.")
    }
};

function positionSuccess(position) {
    //got the geolocation coords and timestamp
    var latu = position.coords.latitude;
    var longu = position.coords.longitude;
    var timeStampu = position.timestamp;

    //center the map at position
    map.panTo({
        lat: latu,
        lng: longu
    });

    //add the "U" marker at position
    var umarker = new google.maps.Marker({
        position: {
            lat: latu,
            lng: longu
        },
        map: map,
          label: {
    text: 'U',
//    color: 'white',
  },
       
        title: 'Your current position!'
    });
    umarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

    //add the click listener to the "U" marker
        //click will get position of marker
        //remove the old marker
        //get current timestamp
        //add position and timestamp to localStorage
        //add new marker to map with click listener to show infoWindow with time and date
    umarker.addListener('click', function () {
        //        let latinner = this.position[lat];//???1 how to access to object umarker's object position's property value?
        //        let lnginner = this.position[lng];
        
        this.setPosition(null); // remove marker
        let point = {
            lat: latu,
            lng: longu,
            timestamp: timeStampu
        }

        //pointsList.push(point);
        let list = JSON.parse(localStorage.getItem('gao00078'));
        list.push(point)
        localStorage.setItem("gao00078", JSON.stringify(list));

        let marker = new google.maps.Marker({
            position: {
                lat: point.lat,
                lng: point.lng
            },
            map: map,
            title: point.timestamp.toString()
        });
        marker.addListener('click', function () {
            var d = new Date(point.timestamp);
            let infoWindow = new google.maps.InfoWindow({
                position: this.position,
                map: map,
                content: d.toLocaleString()
            });
        });

    });


    //call the function to get the JSON data
    getData();
    
    localStorage.clear();
   
}
function getData(){
    //fetch the JSON data

   let serverData = {
       url: "https://gao00078.edumedia.ca/mad9022/map/stalkr-data.json"
       , 
       
//       url:"./stalkr-data.json",
       
       httpRequest: "GET"
       , getJSON: function () {
           let headers = new Headers();
           headers.append("Content-Type", "text/plain");
           headers.append("Accept", "application/json; charset=utf-8");
           // simply show them in the console
           console.dir("headers: " + headers.get("Content-Type"));
           console.dir("headers: " + headers.get("Accept"));
           let options = {
               method: serverData.httpRequest
               , mode: "cors"
               , headers: headers
           };
           //like package
           let request = new Request(serverData.url, options);
           console.log(request);
           fetch(request).then(function (response) {
               console.log(response);
               return response.json();
           }).then(function (data) {
               console.log(data); 
               // now we have JS data, let's display it
               //call a function to handle your data
               displayData(data);
           }).catch(function (err) {
               alert("Error: " + err.message);
           });
       }
   };
    
    serverData.getJSON();
    
    function displayData(data){
        console.log(data.sightings[0].lat);
        //let length = data.sightings.length
        //for(let i = 0; i < length; i++){
        //     pointsList.push(data.sightings[i]);
        //}
        localStorage.clear();
        localStorage.setItem("gao00078", JSON.stringify(data.sightings));
        addMakersFromLocalStroage();
    }
    
    
    //then convert to json
    //then put the data into localStorage
    
    
    //then loop through the array
        //add a marker for each sighting 
        //save the timestamp in the marker title
        //add a click listener for each sighting to create an infoWindow 
        //use the timestamp in the infoWindow... converted to time and date
}

function addMakersFromLocalStroage(){
    let obj = JSON.parse(localStorage.getItem("gao00078"));
    console.log("here: ")
    console.log(obj);
    let length= obj.length;
    console.log(length);
    for (let i = 0; i < length; i++) {
        let marker = new google.maps.Marker({
            position: {
                lat: obj[i].lat
                , lng: obj[i].lng
            }
            , title: obj[i].timestamp.toString()
            , map: map
        , });
        marker.addListener('click', function () {
            var d = new Date(Number(this.title));
            
            let infoWindow = new google.maps.InfoWindow({
                position: this.position
                , map: map
                , content: d.toLocaleString()
            });
        });
    }
     
    
}

function positionError(error) {
    var errors = {
        1: 'Sorry your browser did not have permissions to get your location.',
        2: 'Unable to determine your location.',
        3: 'Location request took too long.'
    };
    //   errors[1]
    alert("Error: " + errors[error.code] + "... " + error.message);
}

