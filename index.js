"use strict";
// a = 2;
// alert("JS working");

// ========= INITIALISATION ============

const DEBUG = true;

const state = {
	operandA: "",
	operandB: "",
	operator: undefined
}; 
// I actually hate having an object called "state" but I need
// to be able to decide which of these primitives I *mean*
// before I start passing them around and/or modifying them.
clear(state);

const mainReadout = document.querySelector(".main-readout");
const digitButtons = document.querySelectorAll(".digit");
digitButtons.forEach(button => button.addEventListener('click', actionDigit)); // <--- review this line. On paper. Super critical.
const resetButton = document.querySelector(".reset");
resetButton.addEventListener('click', btReset);

updateDisplay();

// ========= INITIALISATION DONE =======

function actionDigit(e) {
	// A digit button has been clicked! Or maybe it's a keypress.
	// (the easiest way to do it from a keypress is to have an event listener
	// on keys, and if it's a digit, it gets sent to here, which then just
	// needs to be able to pull the relevant information from the different
	// event types.)
	
	// console.log(e);
	const digit = e.srcElement.innerText;
	console.log(digit);

	// Create the action object here, with action: "digit"

	const targetOperand = activeOperand();

	if ((digit == ".") && (state[targetOperand].includes("."))) {
		console.log("Only one decimal point allowed!")
		// fire the Undo, flow on to update display
	} else if ((digit == "0") && (state[targetOperand] === "")) {
		// do nothing, flow on to update display
	} else {
		// these lines get wrapped in undo-history-logging
		state[targetOperand] = state[targetOperand].concat(digit);
		if (state[targetOperand].charAt(0) === ".") {
			// normalise any numbers starting with "." to "0."
			state[targetOperand] = "0".concat(state[targetOperand]);
		}
	}
	updateDisplay();
}

function updateDisplay(){
	if (state[activeOperand()] == "") {
		mainReadout.textContent = "(awaiting number)";
	} else {
		mainReadout.textContent = state[activeOperand()];
	}
	if (DEBUG) { logStateReadout() };
}

function logStateReadout() {
	const logState = [
		[state.operandA, Number(state.operandA)], 
		[state.operandB, Number(state.operandB)],
		[state.operator, null],
	];
	console.table(logState);
}

function activeOperand() {
	if (state.operator) {
		return "operandB"
	} return "operandA"
}

function btReset() {
	// Just like starting over
	// I PROBABLY want it to clear the Undo history too.
	clear(state);
	updateDisplay();
}

function clear(state) {
	state.operandA = ""
	state.operandB = ""
	state.operator = undefined
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
