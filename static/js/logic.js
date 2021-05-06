// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Determine marker size
function markerSize(magnitude) {
    return magnitude * 4;
}

// Return the color based on magnitude
function markerColor(magnitude) {
  if (magnitude > 4) {
    return 'red'
  } else if (magnitude > 3) {
    return 'orange'
  } else if (magnitude > 2) {
    return 'yellow'
  } else {
    return 'lime'
  }
}

// GET request, and function to handle returned JSON data
d3.json(queryUrl, function(data) {
  
    var earthquakes = L.geoJSON(data.features, {
      onEachFeature : addPopup,
      pointToLayer: addMarker
    });
  
    createMap(earthquakes);
  
  });
  
  function addMarker(feature, location) {
    var options = {
      stroke: false,
      fillOpacity: 0.5,
      color: markerColor(feature.properties.mag),
      fillColor: markerColor(feature.properties.mag),
      radius: markerSize(feature.properties.mag)
    }
  
    return L.circleMarker(location, options);
  
  }
  
  // Define a function we want to run once for each feature in the features array
  function addPopup(feature, layer) {
      // Give each feature a popup describing the place and time of the earthquake
      layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);
  }


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

      // Create legend
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function () {
          var div = L.DomUtil.create('div', 'info legend')
          div.innerHTML = "<h3>Magnitude Legend</h3><table><tr><th>>= 4</th><td>Red</td></tr><tr><th>>= 3</th><td>Orange</td></tr><tr><th>>= 2</th><td>Yellow</td></tr><tr><th>< 2</th><td>Green</td></tr></table>";
          return div;
      };
      
      legend.addTo(myMap);

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
