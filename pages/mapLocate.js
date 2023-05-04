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

function openModal(Lat, Long) {
    var modal = document.getElementById("modal");
    modal.style.opacity = "1";
    modal.style.zIndex = "2";
    
    var mailForm = document.getElementById("emailSend");
    const actionArr = mailForm.action.split("/");
    if (actionArr.length == 5) {
        mailForm.action += `/${Lat}/${Long}`;
    } else {
        mailForm.action = `${actionArr[0]}/${actionArr[1]}/${actionArr[2]}/${actionArr[3]}/${actionArr[4]}`
        mailForm.action += `/${Lat}/${Long}`;
    }
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.opacity = "0";
    modal.style.zIndex = "-1";
}