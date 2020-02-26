let map;
const OTHER_STATES_DATA_PATH = "/../data/otherStates.geojson";
const CAL_BORDER_PATH = "/../data/calBorder.GeoJSON";
const TEXAS_BORDER_PATH = "/../data/texasBorder.GeoJSON";
const RI_BORDER_PATH = "/../data/rIslandBorder.GeoJSON";

let otherStatesData;
let calBorderData;
let texasBorderData;
let rIslandBorderData;

/**
 * create a leaflet map
 * center in US
 * zoom: disabled
 */
function initMap() {
  map = L.map("mapid").setView([37.0902405, -95.7128906], 4.5);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 5,
      noWrap: true,
      minZoom: 5,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiY29zZWNhbnQiLCJhIjoiY2s2dHZqa3lrMDNmZTNlcXB5ajFpemRiYSJ9.y4qDm1J0MJNoFYoHB91meg"
    }
  ).addTo(map);

  // remove zoom control UI
  $(".leaflet-control-zoom").css("visibility", "hidden");

  // setting boundaries so it only show united states
  map.setMaxBounds(
    L.latLngBounds(
      L.latLng(25.837377, -124.327629), //Southwest
      L.latLng(49.384359, -66.885666) //Northeast
    )
  );

  // add geojson to map
}


// map population density to color
function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 500
    ? "#BD0026"
    : d > 200
    ? "#E31A1C"
    : d > 100
    ? "#FC4E2A"
    : d > 50
    ? "#FD8D3C"
    : d > 20
    ? "#FEB24C"
    : d > 10
    ? "#FED976"
    : "#adadad";
}

// style for the 3 picked states
function stylePickedStatesData(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: "#0000ff",
    fillOpacity: 0.1
  };
}

// style for all other states
function styleOtherStates(feature) {
  return {
    fillColor: "gray",
    weight: 2,
    opacity: 1,
    color: "white", //Outline color
    fillOpacity: 0.7
  };
}

// apply style to a layer
function style(data, callback){
  L.geoJson(data, {style: callback}).addTo(map);
}

// load geojson datas
function initLoadGeoJSON(){
  $.getJSON(OTHER_STATES_DATA_PATH, data =>{
    style(data, styleOtherStates);
  });
  $.getJSON(CAL_BORDER_PATH, data =>{
    style(data, stylePickedStatesData);
  });
  $.getJSON(TEXAS_BORDER_PATH, data =>{
    style(data, stylePickedStatesData);
  });
  $.getJSON(RI_BORDER_PATH, data =>{
    style(data, stylePickedStatesData);
  });
}

initMap();
initLoadGeoJSON();









var geojson;

function highlightFeature(e) {
  console.log("mouse in");
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#33cc33",
    dashArray: "",
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  info.update(layer.feature.properties);
}
function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}




// listeners apply on each picked state
function onCalifornia(feature, layer) {
  //触发的function
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: redirectCalPage
  });
}
function onTexas(feature, layer) {
  //触发的function
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: redirectTexasPage
  });
}
function onRhodeIsland(feature, layer) {
  //触发的function
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: redirectRIPage
  });
}


$.getJSON(CAL_BORDER_PATH, data =>{
  geojson = L.geoJson(data, {
    style: stylePickedStatesData,
    onEachFeature: onCalifornia
  }).addTo(map);
});
$.getJSON(TEXAS_BORDER_PATH, data =>{
  geojson = L.geoJson(data, {
    style: stylePickedStatesData,
    onEachFeature: onTexas
  }).addTo(map);
});
$.getJSON(RI_BORDER_PATH, data =>{
  geojson = L.geoJson(data, {
    style: stylePickedStatesData,
    onEachFeature: onRhodeIsland
  }).addTo(map);
});


var info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function(props) {
  this._div.innerHTML =
    "<h4>US Population Density</h4>" +
    (props
      ? "<b>" +
        props.name +
        "</b><br />" +
        props.density +
        " people / mi<sup>2</sup>"
      : "Hover over a state");
};

info.addTo(map);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i] + 1) +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(map);
