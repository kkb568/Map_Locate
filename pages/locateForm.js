var headers = new Headers();
headers.append("X-CSCAPI-KEY", "RXpBRkxwZDBtY0M5UEJiTTRCSENCQmpobmtOYm15T3Y2R0dmR0JCZQ==");

var requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
};

document.addEventListener('DOMContentLoaded', () => {
   const selectCountryDrop = document.querySelector('#country'); 

    fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
    .then(response => response.json())
    .then(data => {
        let output = "<option>-- Select country --</option>";
        data.forEach(country => {
            output +=`<option id="${country.iso2}" value="${country.name}">${country.name}</option>`
        })
        selectCountryDrop.innerHTML = output;
    })
    .catch(error => console.log('error', error));
});

function getSelectedCountry() {
    const selectedCountry = document.getElementById("country");
    const selectedCountryValue = selectedCountry[selectedCountry.selectedIndex].id;
    const selectStateDrop = document.querySelector("#state");

    fetch(`https://api.countrystatecity.in/v1/countries/${selectedCountryValue}/states`, requestOptions)
    .then(response => response.json())
    .then(data => {
        let output1 = "<option>-- Select state --</option>";
        data.forEach(state => {
            output1 += `<option value="${state.name}">${state.name}</option>`
        })
        selectStateDrop.innerHTML = output1;
    })
    .catch(error => console.log('error', error));
}