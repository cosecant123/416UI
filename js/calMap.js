let map;
const CAL_BORDER_PATH = "/../data/calBorder.GeoJSON";
const OTHER_STATES_PATH = "/../data/otherStates.GeoJSON";
const MEXICO_BORDER_PATH = "/../data/mexicoBorder.GeoJSON";
const CAL_COUNTIES_PATH = "/../data/calCounties.GeoJSON";
const TEXAS_BORDER_PATH = "/../data/texasBorder.GeoJSON";
let calBorderData;
let calCountiesData;
let calPrecinctsData;

/**
 * create a leaflet map
 * center in California
 */
function initMap() {
    map = L.map("calMapID").setView([37.0902405, -121.7128906], 6);
    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            noWrap: true,
            minZoom: 6,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "pk.eyJ1IjoiY29zZWNhbnQiLCJhIjoiY2s2dHZqa3lrMDNmZTNlcXB5ajFpemRiYSJ9.y4qDm1J0MJNoFYoHB91meg"
        }
    ).addTo(map);

    // remove zoom control UI
    $(".leaflet-control-zoom").css("visibility", "hidden");

    // setting boundaries so it only show united states
    map.setMaxBounds(
        L.latLngBounds(
            L.latLng(42.837377, -127.327629), //Southwest
            L.latLng(31.384359, -110.885666) //Northeast
        )
    );

    // add geojson to map
}


// style for the 3 picked states
function styleCalBorder(feature) {
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
        fillColor: "transparent",
        weight: 0.5,
        opacity: 1,
        color: "black", //Outline color
        fillOpacity: 0.7
    };
}

function onCaliforniaLocal(feature, layer) {
    //触发的function
    console.log("mouse in");
    // var layer = layer.getElementById("mySidenav");
    layer.on({
        click: openNav
    });
}

initMap();

$.getJSON(OTHER_STATES_PATH, data => {
    L.geoJson(data, { style: styleOtherStates }).addTo(map);
});
$.getJSON(MEXICO_BORDER_PATH, data => {
    L.geoJson(data, { style: styleOtherStates }).addTo(map);
});
$.getJSON(TEXAS_BORDER_PATH, data => {
    L.geoJson(data, { style: styleOtherStates }).addTo(map);
});
$.getJSON(CAL_BORDER_PATH, data => {
    calBorderData = L.geoJson(data, { style: styleCalBorder, onEachFeature: onCaliforniaLocal }).addTo(map);
});



// add listener to the show county and show precinct toggles
document.getElementById("togBtnC").addEventListener("change", function() {
    if (this.checked) {
        $.getJSON(CAL_COUNTIES_PATH, data => {
            calCountiesData = L.geoJson(data, { style: styleCounties }).addTo(map);
        });
    } else {
        map.removeLayer(calCountiesData);
    }
});