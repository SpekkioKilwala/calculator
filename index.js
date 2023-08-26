"use strict";
// a = 2;
// alert("JS working");

// ========= INITIALISATION ============

let operandA;
let operandB;
let operator;
clear();

const mainReadout = document.querySelector(".main-readout");
const digitButtons = document.querySelectorAll(".digit");
digitButtons.forEach(button => button.addEventListener('click', actionClick)); // <--- review this line. On paper. Super critical.

// ========= INITIALISATION DONE =======

function actionClick(e) {
    // console.log(e);
    console.log(e.srcElement.innerText)
}

function clear() {
    operandA = ""; // Number("") -> 0 which displays nicely and you can append to it
    operandB = "";
    operator = undefined; // it's undefined until the user sets it
}

function operate(operator, a, b) {
    return operator(a, b);
}

function add(a, b) {
    return (+a + +b);
}

function subtract(a, b) {
    // ok hang on why do we even need a subtract?
    // because it makes the operations clearer to the user.
    // you can always do a "minus this number" button, or just ask for "(0) - input ="
    return (a - b);
}

function multiply(a, b) {
    return (a * b);
}

function divide(a, b) {
    return (a / b);
}
