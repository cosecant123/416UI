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
    map.options.minZoom = Math.min(5, Math.floor(5*(window.innerWidth/screen.width))+1);
}

function selfInterRedirectHandler(){
    document.getElementById("sf1").addEventListener("click", function(e) {
        // e.target was the clicked element
        if(e.target) {
            recenter(map, allSelfinter[0], 15);
        }
    });
}

function overlappingRedirectHandler(){
    document.getElementById("o1").addEventListener("click", function(e) {
        // e.target was the clicked element
        if(e.target) {
            recenter(map, allOverlap[0], 11);
        }
    });
    document.getElementById("o2").addEventListener("click", function(e) {
        // e.target was the clicked element
        if(e.target) {
            recenter(map, allOverlap[1], 15);
        }
    });
    document.getElementById("o3").addEventListener("click", function(e) {
        // e.target was the clicked element
        if(e.target) {
            recenter(map, allOverlap[2], 15);
        }
    });
}

function handleShowGhost(){
    document.getElementById("errorsName").innerHTML = "Ghost Precincts";
    document.getElementById("errors").innerHTML = "";
    document.getElementById("errorsName").style.backgroundColor = "red";
}

function handleGaps(){
    document.getElementById("errorsName").innerHTML = "Gaps";
    document.getElementById("errors").innerHTML = "";
    document.getElementById("errorsName").style.backgroundColor = "red";
}

function handleSelfIntersect(){
    document.getElementById("errorsName").innerHTML = "Self-Intersect";
    document.getElementById("errors").innerHTML = "";
    let counter = 1;
    allSelfinter.forEach(item => {
        $("#errors").append('<li id="sf1"><a href="#">Self-Intersect ' + counter + '</a></li>');
    });
    document.getElementById("errorsName").style.backgroundColor = "green";
    selfInterRedirectHandler();
}

function handleOverlapping(){
    document.getElementById("errorsName").innerHTML = "Overlapping";
    document.getElementById("errors").innerHTML = "";
    let counter = 1;
    allOverlap.forEach(item => {
        let id = '"o' + counter + '"'; 
        $("#errors").append('<li id=' + id + '><a href="#">Overlapping ' + counter + '</a></li>');
        counter = counter + 1;
    });
    document.getElementById("errorsName").style.backgroundColor = "green";
    overlappingRedirectHandler();
}

function handleShowAllError(){
    document.getElementById("errorsName").innerHTML = "All Errors";
    document.getElementById("errors").innerHTML = "";

    let counter = 1;
    allSelfinter.forEach(item => {
        $("#errors").append('<li id="sf1"><a href="#">Self-Intersect ' + counter + '</a></li>');
        counter = counter + 1;
    });

    counter = 1;
    allOverlap.forEach(item => {
        let id = '"o' + counter + '"'; 
        $("#errors").append('<li id=' + id + '><a href="#">Overlapping ' + counter + '</a></li>');
        counter = counter + 1;
    });
    document.getElementById("errorsName").style.backgroundColor = "green";
    selfInterRedirectHandler();
    overlappingRedirectHandler();
}




function initListeners(){
    try{document.getElementById("refreshButton").addEventListener("click", refresh);} catch (e){}
    try{document.getElementById("calRefreshButton").addEventListener("click", redirectHome);} catch (e){}
    try{document.getElementById("texasRefreshButton").addEventListener("click", redirectHome);} catch (e){}
    try{document.getElementById("rIslandRefreshButton").addEventListener("click", redirectHome);} catch (e){}
    document.getElementById("showCaliforniaButton").addEventListener("click", redirectCalPage);
    document.getElementById("showTexasButton").addEventListener("click", redirectTexasPage);
    document.getElementById("showRhodeButton").addEventListener("click", redirectRIPage);
    window.addEventListener("resize", resizeMap);
    
    document.getElementById("showGhostPrecincts").addEventListener("click", handleShowGhost);
    document.getElementById("showSelfIntersect").addEventListener("click", handleSelfIntersect);
    document.getElementById("showOverlapping").addEventListener("click", handleOverlapping);
    document.getElementById("showGaps").addEventListener("click", handleGaps);
    document.getElementById("showAllErrors").addEventListener("click", handleShowAllError);

    handleShowAllError();
    document.getElementById("errorsName").style.backgroundColor = "#34495e";

 
}

initListeners();