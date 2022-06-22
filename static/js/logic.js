var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link).then(function (data) {
    console.log(data);
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  };
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature) {
              if (feature.geometry.coordinates[2] < 0){
                color = "blue"; 
            }
            else if (feature.geometry.coordinates[2] < 1) {
                color = "yellow";
            }
            else if (feature.geometry.coordinates[2] < 2) {
                color = "pink";
            }
            else if (feature.geometry.coordinates[2] < 3) {
                color = "green";
            }
            else if (feature.geometry.coordinates[2] < 4) {
                color = "orange";
            }
            else if (feature.geometry.coordinates[2] < 5) {
                color = "purple";
            }
            else if (feature.geometry.coordinates[2] < 6) {
                color = "brown";
            }
            else {
                color = "red";
            };
            markerOptions = {
                radius: 4*feature.properties.mag,
                fillColor: color,
                color: "black",
                weight: 1,
                opacity : 1,
                fillOpacity: 0.75,
                color: "black",
                
               
            };
            return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], markerOptions);
        }
    });
  
    // Sending our earthquakes layer to the createMap function/
    createMap(earthquakes);
};
  
function createMap(earthquakes) {
  
    // define street map.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [37.09, -105],
        zoom: 4.5,
        layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);



  function getColor(d) {
    return d <0 ? 'blue' :
          d < 1  ? 'yellow' :
          d < 2  ? 'pink' :
          d < 3  ? 'green' :
          d < 4  ? 'orange' :
          d < 5  ? 'purple' :
          d < 6  ? 'brown' :
                   'red';
                
}

// Create a legend to display information about our map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5, 6],
    labels = [];

    div.innerHTML+='Magnitude<br><hr>'

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
};
    
return div;
};

legend.addTo(myMap);

};
