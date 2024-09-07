"use strict";

/* ---------- DOM VARIABLES ----------- */
const DOM_modals = document.querySelectorAll(".modal");
const DOM_overlay = document.querySelector(".overlay");
const DOM_closeModalButtons = document.querySelectorAll(".close-modal");

const DOM_canvasModal = document.querySelector(".modal--canvas");
const DOM_canvasButton = document.querySelector(".button--canvas");
const DOM_numberForm = document.querySelector(".modal--canvas > form");
const DOM_numberFormInput = document.querySelector(".modal--canvas > form > input");

const DOM_historyModal = document.querySelector(".modal--history");
const DOM_historyButton = document.querySelector(".button--history");

const DOM_helpModal = document.querySelector(".modal--help");
const DOM_helpButton = document.querySelector(".button--help");

const DOM_canvas = document.querySelector(".canvas");
const DOM_etchButtons = document.querySelector(".etch-buttons");
const DOM_blackButton = document.querySelector(".etch-button--black");
const DOM_greenButton = document.querySelector(".etch-button--green");
const DOM_randomButton = document.querySelector(".etch-button--random");
const DOM_eraserButton = document.querySelector(".etch-button--eraser");
const DOM_clearButton = document.querySelector(".etch-button--clear");

/* ------------ STATE VARIABLES ------------- */
let activeButton = DOM_blackButton;
let mouseOverCanvas = false;

DOM_canvas.addEventListener("mouseover", function(e) {
    mouseOverCanvas = true;
})

DOM_canvas.addEventListener("mouseout", function (e) {
    mouseOverCanvas = false;
})

/* ------------- GENERATE INITIAL FRAME ----------- */
function createCanvas(n) {
    Array.from(document.querySelectorAll(".canvas--rectangle")).forEach((rectangle) => rectangle.remove());
    DOM_canvas.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    DOM_canvas.style.gridTemplateRows = `repeat(${n}, 1fr)`;
    const html = `<div class="canvas--rectangle"></div>`
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            DOM_canvas.insertAdjacentHTML("afterbegin", html);
        }
    }
}

createCanvas(20);

/* --------- MODALS -------- */
function closeModal() {
    Array.from(DOM_modals).find((modal) => !modal.classList.contains("hidden")).classList.add("hidden");
    DOM_overlay.classList.add("hidden");
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeModal();
    }
});
DOM_overlay.addEventListener("click", closeModal);
Array.from(DOM_closeModalButtons).forEach((closeButton) => closeButton.addEventListener("click", closeModal));


DOM_canvasButton.addEventListener("click", function(e) {
    DOM_numberFormInput.style.removeProperty("border-color");
    DOM_numberFormInput.value = "";
    DOM_canvasModal.classList.remove("hidden");
    DOM_overlay.classList.remove("hidden");
});


DOM_historyButton.addEventListener("click", function(e) {
    DOM_historyModal.classList.remove("hidden");
    DOM_overlay.classList.remove("hidden");
});

DOM_helpButton.addEventListener("click", function(e) {
    DOM_helpModal.classList.remove("hidden");
    DOM_overlay.classList.remove("hidden");
})

/* ---------------- ETCH BUTTONS --------------- */

DOM_etchButtons.addEventListener("click", function(e) {
    if (e.target.classList.contains("etch-button") && !e.target.classList.contains("etch-button--clear")) {
        activeButton.classList.remove("etch-button--active");
        activeButton = e.target;
        activeButton.classList.add("etch-button--active");
    }
});

function clearCanvas() {
    Array.from(document.querySelectorAll(".canvas--rectangle")).forEach((rectangle) => rectangle.style.backgroundColor = "inherit");
}

DOM_clearButton.addEventListener("click", clearCanvas);

document.addEventListener("keydown", function(e) {
    if (mouseOverCanvas) {
        if (["b", "g", "r", "e"].includes(e.key)) {
            activeButton.classList.remove("etch-button--active");
            switch (e.key) {
                case "b":
                    activeButton = DOM_blackButton;
                    break;
                case "g":
                    activeButton = DOM_greenButton;
                    break;
                case "r":
                    activeButton = DOM_randomButton;
                    break;
                case "e":
                    activeButton = DOM_eraserButton;
                    break;
            }
            activeButton.classList.add("etch-button--active");
        }
        if (e.key === "c") clearCanvas();
    }
});

/* --------------------- DRAWING ---------------------- */

function getRandomInteger(min, max) {
    return min + Math.trunc(Math.random() * (max - min + 1));
}

function getRandomColor() {
    return `rgb(${getRandomInteger(0, 255)}, ${getRandomInteger(0, 255)}, ${getRandomInteger(0, 255)})`
}

DOM_canvas.addEventListener("mouseover", function(e) {
    if (activeButton.classList.contains("etch-button--black")) {
        e.target.style.backgroundColor = "black";
    } else if (activeButton.classList.contains("etch-button--green")) {
        e.target.style.backgroundColor = "hsl(105, 100%, 50%)";
    } else if (activeButton.classList.contains("etch-button--random")) {
        e.target.style.backgroundColor = getRandomColor();
    } else if (activeButton.classList.contains("etch-button--eraser")) {
        e.target.style.backgroundColor = "inherit";
    }
});

/* ----------------------- CREATE NEW CANVAS -------------------- */

DOM_numberForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const n = +DOM_numberFormInput.value;
    if (!Number.isNaN(n) && n >= 1 && n <= 75) {
        DOM_numberFormInput.style.removeProperty("border-color");
        DOM_numberFormInput.value = "";
        createCanvas(n);
        closeModal();
    } else DOM_numberFormInput.style.borderColor = "red";
})