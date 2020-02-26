// file for some basic event handling

// refresh page function
function refresh(){
    location.reload();
}

// resize map to always fit window size
function resizeMap() {
    $("mapid").css('width', str(window.innerHeight*0.925));
    $("mapid").css('height', '210mm');
    map.invalidateSize();
    //document.getElementById("mapid").style.setProperty("height", window.innerHeight * 0.925);
    //document.getElementById("mapid").style.setProperty("width", window.innerWidth);
}

function initListeners(){
    setTimeout(function(){ map.invalidateSize()}, 400);
    document.getElementById("refreshButton").addEventListener("click", refresh);
}

initListeners();