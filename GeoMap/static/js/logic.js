var apiKey = "pk.eyJ1IjoiZGFuamFtbGVlIiwiYSI6ImNrODgwOHdqZjAzamEzbHM0Z3J6enlxemEifQ.Yw88C33x-AZqRXDK5ZuF-A";

var neutralMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: apiKey
});

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: apiKey
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: apiKey
});

//create map, corresponding id and added layers

var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3,
  layers: [neutralMap, satellite, outdoors]
});

neutralMap.addTo(map);

//add layered maps
var tectonic = new L.LayerGroup();

/////////////////////////////////////// var earthquake = new L.Layergroup();
//make layered maps visible
var overlays = {
	"Tectonic Plates": tectonic,
	///////////////////////////////// "Earthquakes": earthquake
};

//create layer choices 

var baseMaps = {
	Satellite: satellite,
	Neutral: neutralMap,
	Outdoors: outdoors
};
//add controls to decide which layer 

L
  .control
  .layers(baseMaps, overlays)
  .addTo(map);

//all earthquake with more than 1, the past month

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson", function(data) {

	//create the circles, with color and radius 

  function style(feature) {
    return {
    	//color
      fillOpacity: 1,
      fillColor: color(feature.properties.mag),
      radius: radius(feature.properties.mag),
    };
  }
  //fill in
  function color(magnitude) {
	  	if (magnitude > 5) {
	  		return "#03034c"
	  	} else if(magnitude > 4) {
	  		return "#0808e9"
	  	} else if (magnitude > 3) {
	  		return "#5454f1"
	  	} else if (magnitude > 2) {
	  		return "#9494ff"
	  	} else if (magnitude > 1) {
	  		return "#d8d8f8"
	  	} else {
	  		return "#000000"
	  	}
  	}
//size of circle
	function radius(magnitude) {
		return magnitude * 4.5
	}


  L.geoJson(data, {
//return circle features
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

   //use stylefunction and create popup info

    style: style,
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.mag + "<br>" + feature.properties.place);
    }

  }).addTo(map);

  tectonic.addTo(map);


/// add tectonicplate lines
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(plate) {
      L.geoJson(plate, {
        color: "red",
        weight: 2
      })

      .addTo(tectonic);
      tectonic.addTo(map);
    });

});
