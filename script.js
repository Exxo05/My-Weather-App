let logotitulo = document.querySelector(".titulo");
let elementoCuerpo = document.querySelector("body");

window.addEventListener("load", () => {
    let numeroRandom = Math.ceil(Math.random() * 5)
    elementoCuerpo.style.backgroundImage = `url('IMAGENES/bg${numeroRandom}.jpg')`;
    if (numeroRandom == 3 || numeroRandom == 4 || numeroRandom == 5) {
        logotitulo.style.color = "white";
    }
});

let putCiudad = document.querySelector("#ciudad");
putCiudad.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        fetchDataFromApi();
    }
});

let datosAPI = {
    url: "http://api.openweathermap.org/data/2.5/weather?q=",
    key: "7ea15b5ede189da436e9374f884ca5b7",
};

putCiudad.value = "Madrid";
fetchDataFromApi();
putCiudad.value = "";

function fetchDataFromApi() {
    let ciudadSeleccionada = putCiudad.value;
    fetch((`${datosAPI.url}${ciudadSeleccionada}&appid=${datosAPI.key}`))
    .then((res) => res.json())
    .then((data) => addDataToDom(data));
}
 let nombreCiudad = document.querySelector(".nombre-ciudad");
 let temperaturaCiudad = document.querySelector(".deg-tiempo");
 let condicionCiudad = document.querySelector(".condicion-tiempo");
 let humedadCiudad = document.querySelector(".humedad");
 let fechadeHoy = document.querySelector(".info-fecha");

 function addDataToDom(data) {
    nombreCiudad.innerHTML = `${data.name}, ${data.sys.country}`;
    temperaturaCiudad.innerHTML = `${Math.round(data.main.temp - 273.15)}ºc`;
    condicionCiudad.innerHTML = data.weather[0].description;
    humedadCiudad.innerHTML = `humidity: ${data.main.humidity}%`;
    fechadeHoy.innerHTML = getDate();
 }

 let meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

 function getDate(){
    let nuevaFecha = new Date();
    let mes = meses[nuevaFecha.getMonth()];
    return `${nuevaFecha.getDate()} ${mes} ${nuevaFecha.getFullYear()}`;
 }