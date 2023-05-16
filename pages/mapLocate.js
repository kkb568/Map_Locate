function openMenu() {
    var menu = document.getElementById("menu-content");
    if (window.innerWidth > 800) {
        menu.style.width = "20%";
    }
    else if (window.innerWidth > 600) {
        menu.style.width = "30%";
    }
    else {
        menu.style.width = "40%";
    }
}

function closeMenu() {
    document.getElementById("menu-content").style.width = "0%";
}