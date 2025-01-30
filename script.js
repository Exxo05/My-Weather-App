let logotitulo = document.querySelector(".titulo");
let elementoCuerpo = document.querySelector("cuerpo");

window.addEventListener("load", () => {
    let numeroRandom = Math.ceil(Math.random() * 5)
    bodyElem.style.backgroundImage = `url(IMAGENES/bg${numeroRandom}.jpng)`;
});


