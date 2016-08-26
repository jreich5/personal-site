// (function() {
"use strict";

// ===========================DRAWING MAP=========================== 


    // Set our map options
    var mapOptions = {
        // Set the zoom level
        zoom: 17,

        // This sets the center of the map at our location
        center: {
            lat:  30.5,
            lng:  -90.5
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var i = 0;


    // Render the map
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);



// ===========================GEOCODING=========================== 



    // Include code from previous example

    // Set our address to geocode
    var address = "18318 Sonterra Pl, San Antonio, TX 78258";

    // Init geocoder object
    var geocoder = new google.maps.Geocoder();

    var addressLatLng;
    // Geocode our address
    geocoder.geocode({ "address": address }, function(results, status) {

       // Check for a successful result
       if (status == google.maps.GeocoderStatus.OK) {

            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();

            addressLatLng = {"Lat":lat, "Lng":lng}

           // Recenter the map over the address
           map.setCenter(results[0].geometry.location);
       } else {
           // Show an error message with the status if our request fails
           alert("Geocoding was not successful - STATUS: " + status);
       }
    });

 // ===========================MARKERS===========================    

// Create lat and long for our marker position
var chama = { lat: 29.6102677, lng: -98.49771579999998 };

// Add the marker to our existing map
var marker = new google.maps.Marker({
    position: chama,
    map: map
});


 // ===========================INFO WINDOW===========================    


// Create a new infoWindow object with content
var infowindow = new google.maps.InfoWindow({
    content: "Chama Gaucha: the <strong>best</strong> dining experience you'll <em>ever</em> have."
});

// Open the window using our map and marker
infowindow.open(map, marker);



// })();