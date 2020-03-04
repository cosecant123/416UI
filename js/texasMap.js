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

    // remove zoom control UI
    $(".leaflet-control-zoom").css("visibility", "hidden");

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
        color: "black", //Outline color
        fillOpacity: 0.7
    };
}

function onTexasLocal(feature, layer) {
    //触发的function
    console.log("mouse in texs");
    // var layer = layer.getElementById("mySidenav");
    layer.on({
        click: openNav
    });
}
// var geoJson;
// var info = L.control();

function highlightLocalFeature(e) {
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
    // info.update(layer.feature.properties);
}

// function resetHighlightLocal(e) {
//     geoJson.resetStyle(e.target);
//     info.update();
// }

function onProblemArea(feature, layer) {
    //触发的function
    layer.on({
        mouseover: highlightLocalFeature,
        // mouseout: resetHighlightLocal
    });
}


initMap();

/**
 * Toolbar for drawing polygon on the map
 */
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);
var drawPluginOptions = {
	position: 'topright',
	draw: {
		polygon: {
			allowIntersection: false,
			drawError: {
				color: '#e1e100'
			},
			shapeOptions: {
				color: '#97009c'
			}
		},
		polyline: false,
		circle: false,
		rectangle: false,
		marker: false,
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

map.on('draw:created', function(e) {
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
    texasBorderData = L.geoJson(data, { style: styleTexasBorder, onEachFeature: onTexasLocal }).addTo(map);
});

//map.removeLayer(texasCountiesData);
// show county border data
$.getJSON(TEXAS_COUNTIES_PATH, data => {
    texasCountiesData = L.geoJson(data, { style: styleCounties, onEachFeature: onTexasLocal }).addTo(map);
});
// $.getJSON(TEXAS_COUNTIES_PATH, data => {
//   texasCountiesData = L.geoJson(data, { style: styleCounties, onEachFeature: onTexasLocal }).addTo(map);
// });


// load precinct border when zoomed in
map.on('zoomend', function() {
    if (map.getZoom() > 8) {
        if (!map.hasLayer(texasPrecinctData)) {
            $.getJSON(TEXAS_PRECINCT_PATH, data => {
                texasPrecinctData = L.geoJson(data, { style: styleCounties, onEachFeature: onProblemArea }).addTo(map);
            });
        }
    } else {
        if (map.hasLayer(texasPrecinctData)) map.removeLayer(texasPrecinctData);
    }
});