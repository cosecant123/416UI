let map;
const RI_BORDER_PATH = "/../data/rIslandBorder.GeoJSON";
const OTHER_STATES_PATH = "/../data/otherStates.GeoJSON";
const RI_COUNTIES_PATH = "/../data/rIslandCounties.GeoJSON";
let rIslandBorderData;
let rIslandCountiesData;
/**
 * create a leaflet map
 * center in US
 * zoom: disabled
 */
function initMap() {
  map = L.map("rIslandMapID").setView([42.0902405, -71.7128906], 10);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      noWrap: true,
      minZoom: 10,
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
      L.latLng(41.997377, -72.327629), //Southwest
      L.latLng(41.384359, -70.885666) //Northeast
    )
  );
}


// style for the 3 picked states
function styleRIBorder(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: "#0000ff",
    fillColor: "white"
  };
}

// style for all other states
function styleOtherStates(feature) {
    return {
      fillColor: "gray",
      weight: 2,
      opacity: 1,
      color: "transparent", //Outline color
      fillOpacity: 0.7
    };
  }

// style for counties
function styleCounties(feature) {
  return {
    fillColor: "#f075e6",
    weight: 5,
    opacity: 1,
    color: "#6eff54", //Outline color
    fillOpacity: 0.7
  };
}

initMap();

$.getJSON(OTHER_STATES_PATH, data =>{
    L.geoJson(data, {style: styleOtherStates}).addTo(map);
});
$.getJSON(RI_BORDER_PATH, data =>{
    rIslandBorderData = L.geoJson(data, {style: styleRIBorder}).addTo(map);
});


// add listener to the show county and show precinct toggles
document.getElementById("togBtnC").addEventListener("change", function(){
  if (this.checked){
    $.getJSON(RI_COUNTIES_PATH, data =>{
      rIslandCountiesData =  L.geoJson(data, {style: styleCounties}).addTo(map);
    });
  }else{
    map.removeLayer(rIslandCountiesData);
  }
});