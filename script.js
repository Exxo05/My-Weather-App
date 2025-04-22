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
    fetch(`${datosAPI.url}${ciudadSeleccionada}&appid=${datosAPI.key}&lang=es`)
        .then((res) => res.json())
        .then((data) => {
            addDataToDom(data);
            fetchForecast(data.name);
        });
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

function getDate() {
    let nuevaFecha = new Date();
    let mes = meses[nuevaFecha.getMonth()];
    return `${nuevaFecha.getDate()} ${mes} ${nuevaFecha.getFullYear()}`;
}

// PRONÓSTICO
function fetchForecast(ciudad) {
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${datosAPI.key}&lang=es`;
    fetch(url)
        .then(res => res.json())
        .then(data => mostrarPronostico(data));
}

function mostrarPronostico(data) {
    const contenedor = document.querySelector(".dias-pronostico");
    contenedor.innerHTML = "";

    const diasAgrupados = {};

    // Agrupamos los datos por día y calculamos la temperatura media
    data.list.forEach(item => {
        const fecha = new Date(item.dt_txt);
        const dia = fecha.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });

        if (!diasAgrupados[dia]) {
            diasAgrupados[dia] = {
                temps: [],
                icono: item.weather[0].icon,
                descripcion: item.weather[0].description
            };
        }

        // Agregar la temperatura a la lista de temperaturas para ese día
        diasAgrupados[dia].temps.push(item.main.temp);
    });

    // Mostrar solo los 5 primeros días
    const dias = Object.keys(diasAgrupados).slice(0, 5);
    dias.forEach(dia => {
        const item = diasAgrupados[dia];
        // Calculamos la media de las temperaturas de ese día
        const tempMedia = Math.round(item.temps.reduce((a, b) => a + b, 0) / item.temps.length - 273.15); // Convertir de Kelvin a Celsius
        const icono = item.icono;
        const descripcion = item.descripcion;

        // Forzamos el uso de los iconos diurnos (sufijo 'd')
        const iconoDia = icono.replace("n", "d");

        contenedor.innerHTML += `
            <div class="dia">
                <p>${dia}</p>
                <img src="http://openweathermap.org/img/wn/${iconoDia}@2x.png" alt="${descripcion}">
                <p>${tempMedia}°C</p>
                <p>${descripcion}</p> <!-- Descripción debajo del ícono -->
            </div>
        `;
    });
}


