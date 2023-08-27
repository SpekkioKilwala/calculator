"use strict";
// a = 2;
// alert("JS working");

// ========= INITIALISATION ============

const DEBUG = true;

const state = {
	operandA: "",
	operandB: "",
	// answer: undefined,
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

const operatorButtons = document.querySelectorAll(".operator");
operatorButtons.forEach(button => button.addEventListener('click', actionOperator));

const equalsButton = document.querySelector(".equals");
equalsButton.addEventListener("click", actionOperator); // convenient to put on the operators too

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

	const targetOperand = activeOperand(); // only ever A or B

	if ((digit == ".") && (state[targetOperand].includes("."))) {
		console.log("Only one decimal point allowed!")
		// raise the Undo flag, flow on to update display
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

function actionOperator(e) {
	const op = e.srcElement.innerText;
	console.log(op);

	// If you have only one (simple operation):
	//	set the state.operator accordingly.
	// 	(then, digit inputs will target the *second* operator)
	// If you have TWO operators (multi-step operation):
	//	act as if the user just hit the equals key *first*.
	//	(then, do the first thing.)
	// Which rearranges to: check for 2-op -> do Equals, then do 1-op.

	// FURTHERMORE, that Equals operation needs to be part of the same
	// "transaction", so (since I don't want to redesign the action history)
	// this same action-handler needs to handle equals *too*.

	// action-history Undo starts *here* <====

	if (operands() == 0) {
		// do nothing. Maybe tell the user to input something.
	} else if (operands() == 1) {
		if (op == "=") {
			// error / do nothing
		} else {
			state.operator = op; // <=== history wrap
		}
	} else { // 2 valid operators
		if (op == "=") {
			equals();
		} else {
			equals();
			state.operator = op; // <=== history wrap
		}
	}
	updateDisplay();
}

function operands(){
	// work out how many usable operands we have
	let tally = 0;
	if ((state.operandA != "") || ("answer" in state)) {tally += 1;}
	if (state.operandB != "") {tally += 1;}
	return tally
}

function equals(){
	// we "should" have 2 usable operands and an operator
	// SEND IT
	if (operands < 2) {
		//error, do nothing, raise the undo flag
		alert("error, not enough operators")
	} else {
		const newAnswer = operate(decipherSymbol(state.operator), eitherA(), state.operandB);
		clear(state);
		state["answer"] = String(newAnswer);
	}
}

function eitherA() {
	// If you have a valid A, give that,
	// else if you have a valid last-answer, give THAT,
	// else give ""
	if (state.operandA != "") {
		return state.operandA;
	}
	if ("answer" in state) {
		return state.answer;
	}
	return "";
}

function decipherSymbol(key) {
	switch (state.operator) {
		case '+':
			return add;
		case '-':
			return subtract;
		case '*':
			return multiply;
		case '/':
			return divide;
		default:
			return key;
	}
}

function updateDisplay() {
	// This function should fire on any user interaction!
	// That makes it useful for closing off Undo steps.
	const answerOrA = eitherA();
	if (state.operandB != "") {
		mainReadout.textContent = roundNumber(state.operandB);
	} else if (answerOrA == "") {
		mainReadout.textContent = "ready!";
	} else {
		mainReadout.textContent = roundNumber(answerOrA);
	}
	if (DEBUG) { logStateReadout() };
}

function roundNumber(maybeLong) {
	// Given a number, if it's very long, display it
	// in scientific form instead.
	// 5 significant digits?
	if (Number(maybeLong) == NaN) {
		return maybeLong
	}
	if (maybeLong.length <= 12) {
		return maybeLong
	}
	return Number(maybeLong).toExponential(6)
}

function logStateReadout() {
	const logState = [
		[state.operandA, Number(state.operandA)], 
		[state.operandB, Number(state.operandB)],
		[state.operator, null],
		[state.answer, operands()],
	];
	console.table(logState);
}

function activeOperand() {
	// Determines which of the TWO valid operands (A or B)
	// is valid for accepting user input.
	// (the "previous answer" variable is a possible
	// subsitute for A, not valid for further input)
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
	// consider splitting this into a soft-clear and a hard-clear
	// soft-clear preserves undo history, hard-clear doesn't
	// The button is hard-clear, and soft-clear is currently
	// just a normal part of giving the answer to an operation
	state.operandA = "";
	state.operandB = "";
	delete state.answer;
	state.operator = undefined;
}

function operate(operator, a, b) {
	// console.log(operator, a, b);
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
