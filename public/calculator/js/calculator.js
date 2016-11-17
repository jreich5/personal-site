(function() {
'use strict';


// ==================== DEFINITIONS ==================== //

// Variable definitions
var leftDisplay = document.getElementById("leftOperandDisplay");
var operatorDisplay = document.getElementById("operatorDisplay");
var rightDisplay = document.getElementById("rightOperandDisplay");
var numberButtons = document.getElementsByClassName("number");
var operatorButtons = document.getElementsByClassName("operator");
var clear = document.getElementById("b-clear");
var equals = document.getElementById("b-equals");

// Operations object
var math_it_up = {
    '+': function (x, y) { return x + y },
    '-': function (x, y) { return x - y },
    '*': function (x, y) { return x * y },
    '/': function (x, y) { return x / y }
};

// ========Function Definitions========

// Functions to handle button click display outputs and limit number of digits
function outputToDisplay (event) {
    console.log("Output to display triggered");    
    if (operatorDisplay.innerHTML.length == "") {
        if (leftDisplay.innerHTML.length < 9) {
            leftDisplay.innerHTML += this.innerHTML;
        }
    } else {
        if (rightDisplay.innerHTML.length < 9) {
            rightDisplay.innerHTML += this.innerHTML;
        }
    }
}

// Handler function for operator
function outputToOperator (event) {
    if (!!leftDisplay.innerHTML == false) {
        alert("First enter a number.");
    } else {
        operatorDisplay.innerHTML = this.innerHTML;
    }
}

// Adds event listeners to all number buttons
function toDisplayer () {
    for (var i = 0; i < numberButtons.length; i += 1) {
        var button = numberButtons[i];
        button.addEventListener('click', outputToDisplay);
    }
}

// Event listeners applied to operator buttons
function operatorDisplayer () {
    for (var i = 0; i < operatorButtons.length; i += 1) {
        var button = operatorButtons[i];
        button.addEventListener('click', outputToOperator);
    }
}

// Outputs innerHTML to display divs
function displayController () {
    toDisplayer();
    operatorDisplayer();
}

// Clear button functionality
function clearCal () {
    leftDisplay.innerHTML = "";
    operatorDisplay.innerHTML = "";
    rightDisplay.innerHTML = "";
}

// Functionality for = button
function runOperations () {
    console.log("Run Operations Triggered");
    if (!!rightDisplay.innerHTML == true) { // If statement stops "=" sign from firing if no right operand
        console.log("!!rightDisplay.innerHTML == true");
        var sign = operatorDisplay.innerHTML;
        var left = parseFloat(leftDisplay.innerHTML);
        var right = parseFloat(rightDisplay.innerHTML);
        var result = (math_it_up[sign](left, right));
        var exponant = 0;
        result = result.toString();
        if (result.toLowerCase() == 'infinity') {
            result = 'ERROR';
        }
        if (result.length > 9) {
            if (parseFloat(result) > 1) {
                console.log('parseInt(result) should be greater than 1.');
                while (result.length > 2) {
                    result = parseInt(result);
                    result /= 10;
                    exponant += 1;
                    result = result.toString();
                }
                result = (result + " " + "e" + exponant); 
            } else {
                result = parseFloat(result);
                result = Math.round(result*10000)/10000;
                console.log("Math.round fired!");
                result = result.toString();
            }
        }
        leftDisplay.innerHTML = result;
        operatorDisplay.innerHTML = "";
        rightDisplay.innerHTML = "";
    }
}


// ==================== PROCEDURE ==================== //


displayController();

// Clear button
clear.addEventListener('click', clearCal);

// Equals button
equals.addEventListener('click', runOperations);

// C keyboard input
addEventListener("keydown", function(event) {
    if (event.keyCode == 67) { // c for clear
        clearCal();
    }
});

addEventListener("keydown", function(event) {
    if (event.keyCode == 13) { // enter
        runOperations();
    }
});


})()
