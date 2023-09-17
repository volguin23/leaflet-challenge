// Store the API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function(data) {
  // Send the data.features object to the features function.
  features(data.features);
});

function features(data) {
  // Define a function to assign color based on depth.
  function getcolor(depth) {
    if (depth < 10) {
      return "green";
    } else if (depth < 30) {
      return "greenyellow";
    } else if (depth < 50) {
      return "yellow";
    } else if (depth < 70) {
      return "orange";
    } else if (depth < 90) {
      return "orangered";
    } else {
      return "red";
    }
  }

  // Create the popup that indicate the place, magnitude and depth
  function PopUpFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create the GeoJSON layer 
  // Run the PopUpFeature function 
  var earthquakes = L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 10,
        fillColor: getcolor(feature.geometry.coordinates[2]),
        color: "brown",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
      });
    },
    onEachFeature: PopUpFeature
  });

  // Add the earthquakes layer to the createMap function.
  createMap(earthquakes);
}

// Create the base layers.
function createMap(earthquakes) {
  
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
 
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create the map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [51.55629195943917, 5.084652965475232],
    zoom: 3,
    layers: [street, earthquakes]
  });

  // Create a layer control.

  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(myMap);
}