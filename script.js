// --- CONFIGURATION ---
const API_BASE_URL = "http://api.openweathermap.org/data/2.5/";
const API_LANG = "es";
const LOCALSTORAGE_API_KEY = 'openweathermapApiKey';
const LOCALSTORAGE_LAST_CITY = 'lastSearchedCity';
const LOCALSTORAGE_PREFERRED_UNIT = 'preferredUnit';
const UNIT_CELSIUS = "celsius";
const UNIT_FAHRENHEIT = "fahrenheit";
const DEFAULT_CITY = "Madrid";

// --- DOM ELEMENT SELECTORS ---
const dom = {
    tituloLogo: document.querySelector(".titulo"),
    cuerpo: document.querySelector("body"),
    ciudadInput: document.querySelector("#ciudad"),
    apiKeyInput: document.getElementById('apiKey'),
    saveApiKeyButton: document.getElementById('saveApiKey'),
    apiKeyMessage: document.getElementById('apiKeyMessage'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    generalErrorMessage: document.getElementById('errorMessage'),
    unitToggleButton: document.getElementById('unitToggleBtn'),
    nombreCiudad: document.querySelector(".nombre-ciudad"),
    temperaturaCiudad: document.querySelector(".deg-tiempo"),
    condicionCiudad: document.querySelector(".condicion-tiempo"),
    humedadCiudad: document.querySelector(".humedad"),
    fechadeHoy: document.querySelector(".info-fecha"),
    forecastContainer: document.querySelector(".dias-pronostico")
};

// --- GLOBAL STATE ---
let preferredUnit = localStorage.getItem(LOCALSTORAGE_PREFERRED_UNIT) || UNIT_CELSIUS;
let lastWeatherData = null;
let lastForecastData = null;
const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];


// --- UTILITY FUNCTIONS ---
function convertToFahrenheit(celsiusTemp) {
    return Math.round((celsiusTemp * 9/5) + 32);
}

// Not strictly needed if base is always Celsius, but good for completeness
function convertToCelsius(fahrenheitTemp) {
    return Math.round((fahrenheitTemp - 32) * 5/9);
}

function updateUnitToggleButton() {
    if (preferredUnit === UNIT_CELSIUS) {
        unitToggleButton.textContent = "Switch to °F";
    } else {
        unitToggleButton.textContent = "Switch to °C";
    }
}

function getApiKey() {
    let key = localStorage.getItem('openweathermapApiKey');
    if (key) {
        apiKeyInput.value = key; // Populate input field for visibility
        return key;
    }
    key = apiKeyInput.value.trim();
    if (key) {
        return key;
    }
    return null;
}

function saveApiKey() {
    const keyToSave = apiKeyInput.value.trim();
    if (keyToSave) {
        localStorage.setItem('openweathermapApiKey', keyToSave);
        apiKeyMessage.textContent = 'API Key saved successfully!';
        apiKeyMessage.className = 'success';
        // Optionally, try fetching data if a city is present
        if (putCiudad.value) {
            fetchDataFromApi();
        }
    } else {
        apiKeyMessage.textContent = 'Please enter a valid API Key.';
        apiKeyMessage.className = 'error';
    }
}

if (saveApiKeyButton) {
    saveApiKeyButton.addEventListener('click', saveApiKey);
}


function getDate() {
    const nuevaFecha = new Date();
    const mes = meses[nuevaFecha.getMonth()];
    return `${nuevaFecha.getDate()} ${mes} ${nuevaFecha.getFullYear()}`;
}

// --- API KEY HANDLING ---
function getApiKey() {
    let key = localStorage.getItem(LOCALSTORAGE_API_KEY);
    if (key) {
        dom.apiKeyInput.value = key;
        return key;
    }
    key = dom.apiKeyInput.value.trim();
    return key || null;
}

function saveApiKey() {
    const keyToSave = dom.apiKeyInput.value.trim();
    if (keyToSave) {
        localStorage.setItem(LOCALSTORAGE_API_KEY, keyToSave);
        dom.apiKeyMessage.textContent = 'API Key saved successfully!';
        dom.apiKeyMessage.className = 'success';
        if (dom.ciudadInput.value) {
            fetchDataFromApi();
        }
    } else {
        dom.apiKeyMessage.textContent = 'Please enter a valid API Key.';
        dom.apiKeyMessage.className = 'error';
    }
}

// --- UI UPDATE FUNCTIONS ---
function updateUnitToggleButton() {
    dom.unitToggleButton.textContent = preferredUnit === UNIT_CELSIUS ? "Switch to °F" : "Switch to °C";
}

function cambiarFondoSegunClima(clima) {
    let imagenFondo = "";
    const lowerClima = clima.toLowerCase();

    if (lowerClima.includes("clear")) imagenFondo = "url('IMAGENES/soleado.jpg')";
    else if (lowerClima.includes("rain")) imagenFondo = "url('IMAGENES/lluvia.jpg')";
    else if (lowerClima.includes("clouds")) imagenFondo = "url('IMAGENES/nublado.jpg')";
    else if (lowerClima.includes("snow")) imagenFondo = "url('IMAGENES/nieve.jpg')";
    else if (lowerClima.includes("thunderstorm")) imagenFondo = "url('IMAGENES/tormenta.jpg')";
    else if (lowerClima.includes("drizzle")) imagenFondo = "url('IMAGENES/llovizna.jpg')";
    else if (lowerClima.includes("mist") || lowerClima.includes("fog")) imagenFondo = "url('IMAGENES/niebla.jpg')";
    else imagenFondo = "url('IMAGENES/default.jpg')";

    dom.cuerpo.style.backgroundImage = imagenFondo;
    dom.cuerpo.style.backgroundSize = "cover";
}

function clearWeatherData(clearCityName = true) {
    if (clearCityName) {
        dom.nombreCiudad.innerHTML = "";
    }
    dom.temperaturaCiudad.innerHTML = preferredUnit === UNIT_CELSIUS ? "--°C" : "--°F";
    delete dom.temperaturaCiudad.dataset.tempCelsius;
    dom.condicionCiudad.innerHTML = "";
    dom.humedadCiudad.innerHTML = "";
    dom.fechadeHoy.innerHTML = getDate();
    dom.forecastContainer.innerHTML = "";
    dom.cuerpo.style.backgroundImage = "url('IMAGENES/default.jpg')";
}

// --- DATA DISPLAY FUNCTIONS ---
function displayCurrentWeather() {
    if (!lastWeatherData) {
        dom.temperaturaCiudad.innerHTML = preferredUnit === UNIT_CELSIUS ? "--°C" : "--°F";
        dom.condicionCiudad.innerHTML = "";
        dom.humedadCiudad.innerHTML = "";
        dom.nombreCiudad.innerHTML = "Cargando datos...";
        return;
    }

    const data = lastWeatherData;

    if (data.name && data.sys && data.sys.country) {
        dom.nombreCiudad.innerHTML = `${data.name}, ${data.sys.country}`;
    } else {
        dom.nombreCiudad.innerHTML = "Información de ciudad no disponible";
    }

    if (data.main && typeof data.main.temp !== 'undefined') {
        const tempCelsius = Math.round(data.main.temp - 273.15);
        dom.temperaturaCiudad.dataset.tempCelsius = tempCelsius;
        dom.temperaturaCiudad.innerHTML = preferredUnit === UNIT_FAHRENHEIT ? 
            `${convertToFahrenheit(tempCelsius)}°F` : `${tempCelsius}°C`;
    } else {
        dom.temperaturaCiudad.innerHTML = preferredUnit === UNIT_CELSIUS ? "--°C" : "--°F";
        delete dom.temperaturaCiudad.dataset.tempCelsius;
    }

    if (data.weather && data.weather[0] && data.weather[0].description) {
        dom.condicionCiudad.innerHTML = data.weather[0].description;
        cambiarFondoSegunClima(data.weather[0].main); // Pass main weather condition
    } else {
        dom.condicionCiudad.innerHTML = "";
        cambiarFondoSegunClima("default"); // Reset background
    }
    
    dom.humedadCiudad.innerHTML = data.main && typeof data.main.humidity !== 'undefined' ?
        `humedad: ${data.main.humidity}%` : "";
    
    dom.fechadeHoy.innerHTML = getDate();
}

function displayForecast() {
    if (!lastForecastData || !lastForecastData.list || lastForecastData.list.length === 0) {
        dom.forecastContainer.innerHTML = "<p>No hay datos de pronóstico disponibles.</p>";
        return;
    }
    
    dom.forecastContainer.innerHTML = ""; 

    const diasAgrupados = {};
    lastForecastData.list.forEach(item => {
        const fecha = new Date(item.dt_txt);
        const diaKey = fecha.toISOString().split('T')[0];

        if (!diasAgrupados[diaKey]) {
            diasAgrupados[diaKey] = {
                tempsKelvin: [],
                iconos: [],
                descripciones: [],
                fechaMostrada: fecha.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })
            };
        }
        diasAgrupados[diaKey].tempsKelvin.push(item.main.temp);
        diasAgrupados[diaKey].iconos.push(item.weather[0].icon);
        diasAgrupados[diaKey].descripciones.push(item.weather[0].description);
    });
    
    Object.keys(diasAgrupados).slice(0, 5).forEach(diaKey => {
        const itemDia = diasAgrupados[diaKey];
        const avgKelvin = itemDia.tempsKelvin.reduce((a, b) => a + b, 0) / itemDia.tempsKelvin.length;
        const tempMediaCelsius = Math.round(avgKelvin - 273.15);
        const icono = itemDia.iconos[0] ? itemDia.iconos[0].replace("n", "d") : "01d";
        const descripcion = itemDia.descripciones[0] || "No disponible";
        const displayTemp = preferredUnit === UNIT_FAHRENHEIT ?
            `${convertToFahrenheit(tempMediaCelsius)}°F` : `${tempMediaCelsius}°C`;

        dom.forecastContainer.innerHTML += `
            <div class="dia" data-temp-celsius="${tempMediaCelsius}">
                <p>${itemDia.fechaMostrada}</p>
                <img src="http://openweathermap.org/img/wn/${icono}@2x.png" alt="${descripcion}">
                <p class="temp-forecast">${displayTemp}</p>
                <p>${descripcion}</p>
            </div>
        `;
    });
}

// --- API FETCHING ---
function handleFetchError(response, ciudadSeleccionada) {
    lastWeatherData = null; // Clear data on any fetch error for current weather
    if (response.status === 401) {
        dom.apiKeyMessage.textContent = 'Invalid API Key. Please check and save it again.';
        dom.apiKeyMessage.className = 'error';
        clearWeatherData();
    } else if (response.status === 404) {
        dom.generalErrorMessage.textContent = `City "${ciudadSeleccionada}" not found. Please check the name.`;
        dom.generalErrorMessage.style.display = 'block';
        clearWeatherData(false); 
    } else {
        dom.generalErrorMessage.textContent = `Error fetching data: ${response.statusText} (Code: ${response.status})`;
        dom.generalErrorMessage.style.display = 'block';
        clearWeatherData();
    }
}

function fetchDataFromApi() {
    const apiKey = getApiKey();
    if (!apiKey) {
        dom.apiKeyMessage.textContent = 'API Key is missing. Please enter and save your API Key.';
        dom.apiKeyMessage.className = 'error';
        clearWeatherData();
        return;
    }
    const ciudadSeleccionada = dom.ciudadInput.value.trim();
    if (!ciudadSeleccionada) {
        dom.generalErrorMessage.textContent = 'Please enter a city name.';
        dom.generalErrorMessage.style.display = 'block';
        return; 
    }
    localStorage.setItem(LOCALSTORAGE_LAST_CITY, ciudadSeleccionada);

    dom.loadingIndicator.style.display = 'block';
    dom.generalErrorMessage.style.display = 'none';
    dom.apiKeyMessage.textContent = '';

    fetch(`${API_BASE_URL}weather?q=${ciudadSeleccionada}&appid=${apiKey}&lang=${API_LANG}`)
        .then((res) => {
            if (!res.ok) {
                handleFetchError(res, ciudadSeleccionada);
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((apiData) => { // Renamed to avoid conflict
            if (apiData.cod && parseInt(apiData.cod) !== 200 && apiData.message) {
                dom.generalErrorMessage.textContent = `API Error: ${apiData.message}`;
                dom.generalErrorMessage.style.display = 'block';
                clearWeatherData();
                lastWeatherData = null;
                throw new Error(`API Error: ${apiData.message}`);
            }
            lastWeatherData = apiData;
            displayCurrentWeather();
            fetchForecast(apiData.name, apiKey);
            dom.generalErrorMessage.style.display = 'none'; 
            dom.apiKeyMessage.textContent = '';
        })
        .catch(error => {
            console.error("Error fetching current weather data:", error.message);
            if (!dom.apiKeyMessage.textContent.includes('API Key') && !dom.generalErrorMessage.textContent) {
                 dom.generalErrorMessage.textContent = 'Could not fetch weather data. Check connection or see console.';
                 dom.generalErrorMessage.style.display = 'block';
            }
        })
        .finally(() => {
            dom.loadingIndicator.style.display = 'none';
        });
}

function fetchForecast(ciudad, apiKey) { 
    if (!apiKey) {
        dom.forecastContainer.innerHTML = ""; // Clear forecast if no key
        lastForecastData = null;
        return;
    }
    if (!ciudad) {
        dom.forecastContainer.innerHTML = "<p>Ciudad no especificada para pronóstico.</p>";
        lastForecastData = null;
        return;
    }

    dom.forecastContainer.innerHTML = "Cargando pronóstico..."; 

    const forecastUrl = `${API_BASE_URL}forecast?q=${ciudad}&appid=${apiKey}&lang=${API_LANG}`;
    fetch(url)
        .then(res => {
            if (!res.ok) {
                if (res.status === 401 && !apiKeyMessage.textContent) {
                    // This case should ideally be caught by the main fetch first.
                } else if (res.status === 404) {
                    forecastContainer.innerHTML = `<p>Pronóstico no encontrado para ${ciudad}.</p>`;
                } else if (res.status !== 401) { 
                    forecastContainer.innerHTML = `<p>Error al cargar pronóstico (HTTP ${res.status}).</p>`;
                }
                lastForecastData = null; // Clear previous forecast data on error
                throw new Error(`HTTP error! status: ${res.status} for forecast`);
            }
            return res.json();
        })
        .then(apiData => { // Renamed to avoid conflict with outer scope 'data'
            if (apiData.cod && apiData.cod !== "200") {
                forecastContainer.innerHTML = `<p>No se pudo cargar el pronóstico: ${apiData.message || 'Error desconocido'}</p>`;
                lastForecastData = null;
                return;
            }
            lastForecastData = apiData; // Store successful forecast response
            displayForecast(); // Call the new display function
        })
        .catch(error => {
            console.error("Error fetching forecast data:", error);
            if (!forecastContainer.innerHTML.includes("Pronóstico no encontrado") && !forecastContainer.innerHTML.includes("Error al cargar pronóstico")) {
                 forecastContainer.innerHTML = `<p>Error al cargar datos del pronóstico.</p>`;
            }
            lastForecastData = null;
        });
}

// Renamed mostrarPronostico to displayForecast and modified its role
function displayForecast() {
    const contenedor = document.querySelector(".dias-pronostico");
    if (!lastForecastData || !lastForecastData.list || lastForecastData.list.length === 0) {
        contenedor.innerHTML = "<p>No hay datos de pronóstico disponibles.</p>";
        return;
    }
    
    contenedor.innerHTML = ""; // Clear previous forecast

    const diasAgrupados = {};
    lastForecastData.list.forEach(item => {
        const fecha = new Date(item.dt_txt);
        const diaKey = fecha.toISOString().split('T')[0];

        if (!diasAgrupados[diaKey]) {
            diasAgrupados[diaKey] = {
                tempsKelvin: [], // Store raw Kelvin temps to average before converting to Celsius
                iconos: [],
                descripciones: [],
                fechaMostrada: fecha.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })
            };
        }
        diasAgrupados[diaKey].tempsKelvin.push(item.main.temp);
        diasAgrupados[diaKey].iconos.push(item.weather[0].icon);
        diasAgrupados[diaKey].descripciones.push(item.weather[0].description);
    });
    
    const diasUnicos = Object.keys(diasAgrupados).slice(0, 5);
    diasUnicos.forEach(diaKey => {
        const itemDia = diasAgrupados[diaKey];
        
        // Calculate average Kelvin then convert to Celsius
        const avgKelvin = itemDia.tempsKelvin.reduce((a, b) => a + b, 0) / itemDia.tempsKelvin.length;
        const tempMediaCelsius = Math.round(avgKelvin - 273.15);
        
        const icono = itemDia.iconos[0] ? itemDia.iconos[0].replace("n", "d") : "01d";
        const descripcion = itemDia.descripciones[0] || "No disponible";

        let displayTemp;
        if (preferredUnit === UNIT_FAHRENHEIT) {
            displayTemp = `${convertToFahrenheit(tempMediaCelsius)}°F`;
        } else {
            displayTemp = `${tempMediaCelsius}°C`;
        }

        // Store base Celsius on the element for potential direct updates if needed, though re-calling displayForecast() is also fine.
        contenedor.innerHTML += `
            <div class="dia" data-temp-celsius="${tempMediaCelsius}">
                <p>${itemDia.fechaMostrada}</p>
                <img src="http://openweathermap.org/img/wn/${icono}@2x.png" alt="${descripcion}">
                <p class="temp-forecast">${displayTemp}</p>
                <p>${descripcion}</p>
            </div>
        `;
    });
}


