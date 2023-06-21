function openModal() {
    var modal = document.getElementById("modal");
    modal.style.opacity = '1';
    modal.style.zIndex = '2';
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.opacity = '0';
    modal.style.zIndex = '-1';
}

function countChars(obj, valueText) {
    var strLength = obj.value.length;
    var text = document.getElementById(valueText);
    text.innerHTML = '<i>Total: ' + strLength + ' characters</i>';
}