// file for some basic event handling

// refresh page function
function refresh(){
    location.reload();
}

// redirect to cal state map page
function redirectHome(){
    window.location = "/../map.html";
}

// redirect to cal state map page
function redirectCalPage(){
    window.location = "/../calStateMap.html";
}

// redirect to cal state map page
function redirectTexasPage(){
    window.location = "/../texasStateMap.html";
}

// redirect to cal state map page
function redirectRIPage(){
    window.location = "/../rIslandStateMap.html";
}

// resize map to always fit window size
function resizeMap() {
    map.options.minZoom = Math.min(5, Math.floor(5*(window.innerWidth/screen.width))+1);;
}

function initListeners(){
    try{document.getElementById("refreshButton").addEventListener("click", refresh);} catch (e){}
    try{document.getElementById("calRefreshButton").addEventListener("click", redirectHome);} catch (e){}
    try{document.getElementById("texasRefreshButton").addEventListener("click", redirectHome);} catch (e){}
    try{document.getElementById("rIslandRefreshButton").addEventListener("click", redirectHome);} catch (e){}
    document.getElementById("showCaliforniaButton").addEventListener("click", redirectCalPage);
    document.getElementById("showTexasButton").addEventListener("click", redirectTexasPage);
    document.getElementById("showRhodeButton").addEventListener("click", redirectRIPage);
    setTimeout(function(){ map.invalidateSize()}, 200);
    window.addEventListener("resize", resizeMap);
}

initListeners();