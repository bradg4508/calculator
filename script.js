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

const valueString = document.querySelector("#value");
const operators = document.querySelectorAll("#operators button");
const equals = document.querySelector("#equals button");

function setValue(e) {
    // Reset the display area to only include the next value entered by the user
    // If you don't reset, every successive value will inaccurately include the 
    //      previously entered value
    if (valueString.textContent.length > 0) {
        valueString.textContent = "";
    }
    // Get the value from the user's button presses as a string from the button's textContent
    valueString.textContent += e.target.textContent;

    // Display the value in a div above the calculator buttons
    num = valueString.textContent;
}

function setOperator(e) {
    // If the total has already been calculated at least once 
    //      (the user has already pressed the "Enter" button), 
    //      do not re-add the previously entered number into the numArray 
    //      when the user chooses to press an operator button again
    
    // If the total has not been calculated yet, 
    //      add the value that was previously entered before the user pressed an operator button
    if (typeof numArray[0] !== "number") {
        numArray.push(num);
    }

    // Get the operator from the user's button press as a string from the button's textContent
    operator = e.target.textContent;

    // Add the operator to the numArray
    numArray.push(operator);
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
    numArray.push(num);
    // Display the current answer to an operation
    valueString.textContent = performOperation();
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
    
});