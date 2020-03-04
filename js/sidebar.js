function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
}


function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function openNavR() {
    document.getElementById("mySidenavR").style.width = "460px";
}

function closeNavR() {
    document.getElementById("mySidenavR").style.width = "0";
}

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
} 