// Create functions to solve basic mathematical operations
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}

// Call the operation that coincides with its operator
// Addition (+), subtraction (-). multiplication (*), division (/)
// Match the operator to its equivalent in Unicode
function operate(num1, operator, num2) {
    if (operator === "\u002B") {
        return add(num1, num2);
    } else if (operator === "\u2212") {
        return subtract(num1, num2);
    } else if (operator === "\u00D7") {
        return multiply(num1, num2);
    } else if (operator === "\u00F7") {
        return divide(num1, num2);
    }
}
let num = "";
let operator = "";
const numArray = [];
let total = 0;
let count = 0;

const valueString = document.querySelector("#value");
const operators = document.querySelectorAll("#operators button");
const equals = document.querySelector("#equals button");
const clearAll = document.querySelector("#clear button");

function setValue(e) {
    // If the user presses the "Equals" button consecutively more than once,
    //      the numArray will only include the number once
    // It allows the user to continue performing operations with accurate results
    // The variable "count" is arbitrary and only needed to indicate that an operation has occurred
    if (count === 1) {
        numArray.splice(0, 1);
    }
    // Get the value from the user's button presses as a string from the button's textContent
    valueString.textContent += e.target.textContent;

    // Display the value in a div above the calculator buttons
    num = +valueString.textContent;

    // Reset the "count" variable to allow for successive operations to be performed
    //      after one has already been completed
    count = 0;
}
function setOperator(e) {
    // Add the value that was previously entered before the user pressed an operator button
    if (valueString.textContent !== "") {
        numArray.push(num);
    }
    // Reset the display area to only include the next value entered by the user
    // If you don't reset, every successive value will inaccurately include the 
    //      previously entered value
    if (valueString.textContent.length > 0) {
        valueString.textContent = "";
    }
    // Get the operator from the user's button press as a string from the button's textContent
    operator = e.target.textContent;

    // Add the operator to the numArray
    numArray.push(operator);
    
    // If the user presses the same "operator" button more than once,
    //      remove the repeated occurrences of the operator so that only one remains in the numArray
    if ((numArray[numArray.indexOf(operator)] === numArray[numArray.indexOf(operator) + 1])) {
        numArray.splice(numArray.indexOf(operator) + 1, 1);
    }
    // If the user continuously presses different "operator" buttons more than once,
    //      the last "operator" button that is pressed will be the one involved in the ongoing operation
    // Remove any other previous button presses of other "operator" buttons from the numArray 
    if((typeof numArray[numArray.indexOf(operator) - 1] === "string") ||
       (numArray.indexOf(operator) === 0)) {
        numArray.splice(numArray.indexOf(operator) - 1, 1);
    }
}
function performOperation() {
    // Run the operate() function on every three elements in the numArray
    // After each operation is completed, replace the three elements in the array with a total
    // Then, the total will be used in any successive operations
    // Once the array is left with the total as its only remaining element, 
    //      the loop is done running and the total can be received by the performCalculation() function
    while(numArray.length > 1) {
        total = operate(+numArray[0],numArray[1],+numArray[2]);
        numArray.splice(0, 3, total);
    }
    return total;
}
function displayCalculation() {
    // Before the calculation is performed, add the the user's most recently entered value 
    //      to the numArray
    // If the user presses the "Enter" button without entering any values yet,
    //      the numArray will not add an empty string as an element
    if (valueString.textContent !== "") {
        numArray.push(num);
    }
    // If the user presses the "Enter" button more than once without adding an operation,
    //      the numArray will only include the previously entered value as its initial element
    if (numArray.length === 2 && (numArray[0] === numArray[1])) {
        numArray.splice(0, 1);
    }
    // Check to see if the numArray has at least three elements
    if (numArray.length >= 3) {
        // If the user presses the "Enter" button consecutively while entering an operation,
        //      the numArray will replace any repeated values so that only one exists
        if ((numArray[0] === numArray[1]) || 
            (numArray[1] === numArray[2])) {
            numArray.splice(0, 2);
        } else {
            // Display the current answer to an operation
            // Change the "count" variable to allow the user to repeatedly press the "Enter" button without
            //      it affecting the elements in the numArray
            num = performOperation();
            valueString.textContent = num;
            count = 1;
            console.log(numArray);
        }
    }
}
function clearValues() {
    // Empty the numArray so that no values or operators currently exist
    numArray.length = 0;

    // Reset the "num" variable after clearing the calculator so that future operations are not impacted by it
    num = "";

    // Show an empty string in the display area
    valueString.textContent = "";
}

// Select each of the buttons that holds a digit (0-9)
// Add an event listener to each digit button in order to display values to the user
//      and store them for performing operations
const digits = document.querySelectorAll("#digits button");
digits.forEach((digit) => {
    digit.addEventListener("click", setValue);
    
    // Select each of the operator buttons (*,/,-,+)
    // Add an event listener to each operator button in order to store them for performing operations
    operators.forEach((operator) => {
        operator.addEventListener("click", setOperator);
    });

    // Add an event listener to the "Enter" button (=) to perform the current operation
    equals.addEventListener("click", displayCalculation);

    // Add an event listener to the "All Clear" button (AC) to reset the calculator and end any ongoing operations
    clearAll.addEventListener("click", clearValues);
    
});


// ISSUES STILL TO RESOLVE
//  -Can still enter values that add on to the most recent total that has just been calculated
//      -I want the new value to override the current total in the display area
//  -Set only the last clicked "operator" button to apply to the next value
//      -Right now, each press adds the previous "num" to be added to the numArray