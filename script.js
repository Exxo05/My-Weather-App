let logotitulo = document.querySelector(".titulo");
let elementoCuerpo = document.querySelector("body");

function cambiarFondoSegunClima(clima) {
    let imagenFondo = "";

    if (clima.includes("clear")) {
        imagenFondo = "url('IMAGENES/soleado.jpg')"; 
    } else if (clima.includes("rain")) {
        imagenFondo = "url('IMAGENES/lluvia.jpg')"; 
    } else if (clima.includes("clouds")) {
        imagenFondo = "url('IMAGENES/nublado.jpg')"; 
    } else if (clima.includes("snow")) {
        imagenFondo = "url('IMAGENES/nieve.jpg')"; 
    } else if (clima.includes("thunderstorm")) {
        imagenFondo = "url('IMAGENES/tormenta.jpg')"; 
    } else if (clima.includes("drizzle")) {
        imagenFondo = "url('IMAGENES/llovizna.jpg')"; 
    } else if (clima.includes("mist") || clima.includes("fog")) {
        imagenFondo = "url('IMAGENES/niebla.jpg')";
    } else {
        imagenFondo = "url('IMAGENES/default.jpg')"; 
    }

    elementoCuerpo.style.backgroundImage = imagenFondo;
    elementoCuerpo.style.backgroundSize = "cover";
    
}
let putCiudad = document.querySelector("#ciudad");
putCiudad.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        fetchDataFromApi();
    }
});

let datosAPI = {
    url: "http://api.openweathermap.org/data/2.5/weather?q=",
    key: "7ea15b5ede189da436e9374f884ca5b7",
    lang: "es"
};

putCiudad.value = "Madrid";
fetchDataFromApi();
putCiudad.value = "";

function fetchDataFromApi() {
    let ciudadSeleccionada = putCiudad.value;
    fetch((`${datosAPI.url}${ciudadSeleccionada}&appid=${datosAPI.key}&lang=es`))
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
    humedadCiudad.innerHTML = `humedad: ${data.main.humidity}%`;
    fechadeHoy.innerHTML = getDate();
    cambiarFondoSegunClima(data.weather[0].main.toLowerCase());
 }

 let meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

 function getDate(){
    let nuevaFecha = new Date();
    let mes = meses[nuevaFecha.getMonth()];
    return `${nuevaFecha.getDate()} ${mes} ${nuevaFecha.getFullYear()}`;
 }