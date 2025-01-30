let logotitulo = document.querySelector(".titulo");
let elementoCuerpo = document.querySelector("cuerpo");

window.addEventListener("load", () => {
    let numeroRandom = Math.ceil(Math.random() * 5)
    bodyElem.style.backgroundImage = `url(IMAGENES/bg${numeroRandom}.jpng)`;
});

let putCiudad = document.querySelector("get-city");
putCiudad.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        fetchDataFromApi();
    }
});

let datosAPI = {
    url: "http://api.openweathermap.org/data/2.5/forecast?q=",
    key: "7ea15b5ede189da436e9374f884ca5b7",
};

putCiudad.value = "Madrid";
fetchDataFromApi();
putCiudad.value = "";

function fetchDataFromApi() {
    let ciudadSelecionada = putCiudad.value;
    fetch((`${datosAPI.url}${ciudadSelecionada}&&appid=${datosAPI.key}`))
    .then((res) => res.json())
    .then((data) => addDataToDom(data));
}
 