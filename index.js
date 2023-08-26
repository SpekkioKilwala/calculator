"use strict";
// a = 2;
// alert("JS working");

let operandA;
let operandB;
let operator;
clear();

function clear() {
    operandA = 0;
    operandB = 0;
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
