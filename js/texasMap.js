let map;
const TEXAS_BORDER_PATH = "/../data/texasBorder.GeoJSON";
const OTHER_STATES_PATH = "/../data/otherStates.GeoJSON";
const MEXICO_BORDER_PATH = "/../data/mexicoBorder.GeoJSON";
const TEXAS_COUNTIES_PATH = "/../data/texasCounties.GeoJSON";
const CAL_BORDER_PATH = "/../data/calBorder.GeoJSON";
const TEXAS_PRECINCT_PATH = "/../data/texasPrecinct.GeoJSON";
let texasBorderData;
let texasCountiesData;
let texasPrecinctData;

let voting2008 = '[{"year": 2008, "county": "Anderson","candidate": "Barack Obama","party": "democrat","candidatevotes": 4630,"totalvotes": 16655}, {"year": 2008, "county": "Anderson","candidate": "John McCain","party": "republican","candidatevotes": 11884,"totalvotes": 16655}]';
let voting2012 = '[{"year": 2012,"county": "Anderson","candidate": "Barack Obama","party": "democrat","candidatevotes": 3813,"totalvotes": 16212}, {"year": 2012,"county": "Anderson","candidate": "Mitt Romney","party": "republican","candidatevotes": 12262,"totalvotes": 16212}]';
let voting2016 = '[{"year": 2016,"county": "Anderson","candidate": "Hillary Clinton","party": "democrat","candidatevotes": 3369,"totalvotes": 16977},{"year": 2016,"county": "Anderson","candidate": "Donald Trump","party": "republican","candidatevotes": 13207,"totalvotes": 16977}]';
var voting2008_JSON = JSON.parse(voting2008);
var voting2012_JSON = JSON.parse(voting2012);
var voting2016_JSON = JSON.parse(voting2016);

/**
 * create a leaflet map
 * center in Texas
 */
function initMap() {
    map = L.map("texasMapID").setView([31.0902405, -98.7128906], 6);
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

    // setting boundaries so it only show united states
    map.setMaxBounds(
        L.latLngBounds(
            L.latLng(37.837377, -108.327629), //Southwest
            L.latLng(25.384359, -92.885666) //Northeast
        )
    );

    // add geojson to map
}

// style for the 3 picked states
function styleTexasBorder(feature) {
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
        color: "blue", //Outline color
        fillOpacity: 0.7,
        dashArray: "20,15"
    };
}

// style for counties
function stylePrecincts(feature) {
    return {
        fillColor: "red",
        weight: 0.5,
        opacity: 1,
        color: "black", //Outline color
        fillOpacity: 0.3
    };
}


initMap();
var texageojson;

function highlightTexasFeature(e) {
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
    // texainfo.update(layer.feature.properties);
}

function resetTexasHighlight(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 0.5,
        color: "#000000",
        dashArray: "",
        fillOpacity: 0.3
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    // texainfo.update();
}

/**
 * Toolbar for drawing polygon on the map
 */
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);
var drawPluginOptions = {
    position: "topright",
    draw: {
        polygon: {
            allowIntersection: false,
            drawError: {
                color: "#e1e100"
            },
            shapeOptions: {
                color: "#97009c"
            }
        },
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false
    },
    edit: {
        featureGroup: editableLayers,
        remove: true
    }
};

var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

map.on("draw:created", function(e) {
    var type = e.layerType,
        layer = e.layer;

    editableLayers.addLayer(layer);
});

$.getJSON(OTHER_STATES_PATH, data => {
    L.geoJson(data, { style: styleOtherStates }).addTo(map);
});
$.getJSON(MEXICO_BORDER_PATH, data => {
    L.geoJson(data, { style: styleOtherStates }).addTo(map);
});
$.getJSON(CAL_BORDER_PATH, data => {
    L.geoJson(data, { style: styleOtherStates }).addTo(map);
});
$.getJSON(TEXAS_BORDER_PATH, data => {
    texasBorderData = L.geoJson(data, {
        style: styleTexasBorder,
        // onEachFeature: onTexasLocal
    }).addTo(map);
});

//map.removeLayer(texasCountiesData);
// show county border data
$.getJSON(TEXAS_COUNTIES_PATH, data => {
    texasCountiesData = L.geoJson(data, {
        style: styleCounties,
    }).addTo(map);
});
// $.getJSON(TEXAS_COUNTIES_PATH, data => {
//   texasCountiesData = L.geoJson(data, { style: styleCounties, onEachFeature: onTexasLocal }).addTo(map);
// });
var texainfo = L.control();

function onTexasPrecincts(feature, layer) {
    //触发的function
    layer.on({
        mouseover: highlightTexasFeature,
        mouseout: resetTexasHighlight,
        click: openNav
    });
}


var allGhost;
var allOverlap = [[33.6294, -99.1351], [29.5517, -98.2357], [31.3302, -94.7244]];
var allSelfinter = [[29.5471, -98.1980]];



function recenter(map, coordinate, zoomSize){
    map.setView(coordinate, zoomSize);
}




// load precinct border when zoomed in
map.on("zoomend", function() {
    if (map.getZoom() > 6) {
        if (!map.hasLayer(texasPrecinctData)) {
            $.getJSON(TEXAS_PRECINCT_PATH, data => {
                texasPrecinctData = L.geoJson(data, {
                    style: stylePrecincts,
                    onEachFeature: onTexasPrecincts
                }).addTo(map);
            });
        }
    } else {
        if (map.hasLayer(texasPrecinctData)) map.removeLayer(texasPrecinctData);
    }
});