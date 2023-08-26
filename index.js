"use strict";
// a = 2;
// alert("JS working");


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

function operate(operand, a, b) {
    return operand(a, b);
}