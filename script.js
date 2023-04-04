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
    if (operator === "\u002B" || operator === "+") {
        return add(num1, num2);
    } else if (operator === "\u2212" || operator === "-") {
        return subtract(num1, num2);
    } else if (operator === "\u00D7" || operator === "*") {
        return multiply(num1, num2);
    } else if (operator === "\u00F7" || operator === "/") {
        return divide(num1, num2);
    }
}
let valueInput = "";
let operatorInput = "";
let calcInput = "";
let num = "";
let operator = "";
const numArray = [];
const digitArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "."];
const operatorArray = ["\u002B", "\u2212", "\u00D7", "\u00F7", "+", "-", "*", "/"];
let total = 0;
let operationComplete = 0;
let equalsOperatingNum = 0;

const valueString = document.querySelector("#value");
const digits = document.querySelectorAll(".digits");
const operators = document.querySelectorAll(".operators");
const equals = document.querySelector("#equals");
const clearAll = document.querySelector("#clear");

// Create functions to recognize the type of event and call the appropriate function
// Add the blur() method to remove focus from any button after clicking it
//      so that the program will always recognize keyboard input
function getValueInput(e) {
    if (e.type === "click") {
      valueInput = e.target.textContent;
      setValue(valueInput);
    } else if (digitArray.includes(e.key)) {
        valueInput = e.key;
        setValue(valueInput);
    } else {
        valueInput = "";
    }
    e.target.blur();
}
function getOperatorInput(e) {
    if (e.type === "click") {
        operatorInput = e.target.textContent;
        setOperator(operatorInput);
    } else if (operatorArray.includes(e.key)) {
        if (e.key === "/") {
            e.preventDefault();
        }
        operatorInput = e.key;
        setOperator(operatorInput);
    } else {
        operatorInput = "";
    }
    e.target.blur();
}
function getCalcInput(e) {
    if (e.type === "click" || e.key === "Enter") {
        displayCalculation();
    }
    e.target.blur();
}
function getClearInput(e) {
    if (e.type === "click" || e.key === "Escape") {
        clearValues();
    }
    e.target.blur();
}
function setValue(input) {
    // If the user divides by zero and then enters a new value, re-enable the operator and equals buttons
    //      to allow for future operations to work with valid inputs
    if (num === Infinity) {
        equals.disabled = false;
        operators.forEach((operator) => operator.disabled = false);
    }
    // Reset the display area to only include the next value entered by the user 
    //      after pressing equals or an operator
    // If you don't reset, every successive value will inaccurately include the 
    //      previously entered value
    if (num === "" || (valueString.textContent === "0" && input !== ".")) {
        valueString.textContent = "";
    }
    // It allows the user to continue performing operations with accurate results
    // The variable operationComplete is arbitrary and only needed to indicate that an operation has occurred
    if (operationComplete === 1 && (numArray.length === 1 || numArray.length === 3) && 
        input !== "." && input !== "Backspace" && input !== "\u2190" && input !== "\u00B1") {
        // If the user presses the Equals button consecutively more than once,
        //      the numArray will only include the number once
        numArray.splice(0, 1);
        // Reset the display area if the user wants to enter a value 
        //      and start performing a different operation
        if (valueString.textContent !== "0.") {
            valueString.textContent = "";
        }
    }
    // Get the value from the user's button presses as a string from the button's textContent
    // For decimal entries, the display will show a 0 in the ones place
    if (input === ".") {
        if (num === "" || num === total) {
            valueString.textContent = "0";
        }
    }
    // Display the current value
    if (input !== "" && input !== "Backspace") {
        valueString.textContent += input;
    }
    // If the user wants to change the sign of the current value, the display will show the sign change
    if (input === "\u00B1") {
        valueString.textContent = valueString.textContent.substring(0, (valueString.textContent.length - 1));
        valueString.textContent = -1 * (+valueString.textContent);
    }
    // If the user enters more than one leading 0, the display will only show a single 0
    if (valueString.textContent.indexOf("0") === 0 && valueString.textContent === "00") {
        valueString.textContent = valueString.textContent.substring(0, (valueString.textContent.length - 1));
    }
    // If the user enters more than one decimal, the display will not show it
    if ((valueString.textContent.match(/\./g) || []).length == 2) {
        valueString.textContent = valueString.textContent.substring(0, (valueString.textContent.length - 1));
    }
    // If the user presses the backspace button or presses the backspace key,
    //      discard the most recently entered value and change the current num variable in the display area
    // If the current value is the result from a previous operation, do not let the backspace button
    //      clear any of the digits in the currently displayed value
    if (input === "\u2190" || input === "Backspace") {
        if (valueString.textContent.length >= 1 && num === total && num !== 0 && numArray.length !== 0) {
            valueString.textContent = num;
        } else if (valueString.textContent.length <= 1) {
            valueString.textContent = "0";
        } else if (valueString.textContent.length > 1 && numArray.length === 0) {
            if (input === "\u2190") {
                valueString.textContent = valueString.textContent.substring(0, (valueString.textContent.length - 2));
            } else if (input === "Backspace") {
                valueString.textContent = valueString.textContent.substring(0, (valueString.textContent.length - 1));
            }
            if (valueString.textContent === "-" || valueString.textContent === "-0" ||
                valueString.textContent === "-0." || valueString.textContent === "0." || 
                valueString.textContent === "") {
                valueString.textContent = "0";
            }
            operationComplete = 0;
        }
    }
    // Store the value in the display above the calculator buttons
    if (valueString.textContent !== "") {
        num = +valueString.textContent;
    }
}
function setOperator(input) {
    // Add the value that was previously entered once the user presses an operator button
    if (num !== "") {
        numArray.push(num);
    }
    // Add 0 to the numArray if it is the first value entered in an operation
    if (valueString.textContent === "0" && numArray.length === 0){
        numArray.push(+valueString.textContent);
    }
    // Show the ongoing total of an operation in the display area 
    //      once it includes 2 values and 1 operator in between the values in the numArray
    if (numArray.length === 3 && numArray[0] !== numArray[1]) {
        num = performOperation();
        valueString.textContent = num;
    }
    // Get the operator from the user's button press as a string from the button's textContent
    if (input !== "") {
        operator = input;
    }
    // Add the operator to the numArray
    if (operator !== "") {
        numArray.push(operator);
    }
    // If the user presses the same operator button more than once,
    //      remove the repeated occurrences of the operator so that only one remains in the numArray
    if ((numArray[numArray.indexOf(operator)] === numArray[numArray.indexOf(operator) + 1])) {
        numArray.splice(numArray.indexOf(operator) + 1, 1);
    }
    // If the user continuously presses different operator buttons more than once,
    //      the last operator button that is pressed will be the one involved in the ongoing operation
    // Remove any other previous button presses of other operator buttons from the numArray 
    if((typeof numArray[numArray.indexOf(operator) - 1] === "string") || (numArray.indexOf(operator) === 0)) {
        numArray.splice(numArray.indexOf(operator) - 1, 1);
    }
    // Reset num to an empty string so that the next entered value can be processed accurately
    // Prevent continuous operator button presses from filling the numArray with copies of its current contents
    num = "";
}
function performOperation() {
    // Run the operate() function on every three elements in the numArray
    // Set the equalsOperatingNum variable to the most recent value to be used in any future
    //      successive operations involving only a press of the equals button by the user
    while(numArray.length > 1) {
        total = operate(+numArray[0],numArray[1],+numArray[2]);
        
        // After each operation is completed, replace the three elements in the array with a total
        // Then, the total will be used in any successive operations
        // Once the array is left with the total as its only remaining element, 
        //      the loop is done running and the total can be received by the performCalculation() function
        numArray.splice(0, 3, total);
    }
    // If the total contains more than 8 decimal places, round it to 8 decimal places
    if (String(total).includes(".")) {
        const decimal = String(total).split(".")[1];
        if (decimal.length > 8) {
            return +((Math.round(total * 100000000) / 100000000).toFixed(8));
        }
    }
    // If the total does not run more than 8 decimal places, just return the total as it is
    return total;
}
function displayCalculation() {
    // Before the calculation is performed, add the the user's most recently entered value 
    //      to the numArray
    // If the user presses the Equals button without entering any values yet,
    //      the numArray will not add an empty string as an element
    if (valueString.textContent !== "" && num !== "") {
        numArray.push(num);
    }
    // If the user enters a value, presses the Equals button, and then re-enters the same value,
    //      the num variable resets to an empty string to avoid adding it on to the display area's current value
    if (numArray.length === 1) {
        num = "";
    }
    // If the user presses the Equals button after entering a value and an operator,
    //      the first operation will be performed as follows: (num) (operator) (num)
    if (numArray.length === 2) {
        if (typeof numArray[1] === "string") {
            numArray.push(+valueString.textContent);
        }
    }
    // If the user repeats the process of entering a value, pressing an operator, 
    //      and then pressing the Equals button, the correct output will display
    if ((typeof numArray[0] === "number") && (typeof numArray[1] === "number")) {
        if (typeof numArray[2] === "string" && numArray[0] === numArray[1]) {
            numArray.splice(1, 1);
            numArray.push(numArray[0]);
            // If the user enters an operation, and then presses the Equals button,
            //      the next total will apply the previous operator and previous second value 
            //      to find its calculation
        } else if(numArray[0] === numArray[1] && operator !== "") {
            numArray.splice(1, 2, operator, equalsOperatingNum);
            // If the user repeats the process of entering a value, pressing the Equals button, 
            //      and then entering a new value, the num variable will reset to an empty string 
            //      and the NumArray will take out the original value from the numArray
        } else {
            numArray.splice(0, 1);
            num = ""; 
        }
    }
    // Check to see if the numArray has at least three elements (3 elements are needed to perform an operation)
    if (numArray.length >= 3 && !numArray.includes(Infinity)) {
        // Display the current answer to an operation
        // Keep the unrounded values present in the numArray by setting the num variable back to total
        //      so that future operations are calculated properly
        // If the answer involves dividing by 0, disable any future operations with this impossible answer
        // Change the operationComplete variable to allow the user to repeatedly press the Equals button without
        //      it affecting the elements in the numArray
        equalsOperatingNum = numArray[(numArray.length - 1)];
        num = performOperation();
        if (num === Infinity) {
            valueString.textContent = "What!? You can't divide by 0!";
            equals.disabled = true;
            operators.forEach((operator) => operator.disabled = true);
        } else {
            valueString.textContent = num;
            num = total;
        }
        operationComplete = 1;
    } else if (numArray.includes(Infinity)) {
        numArray.length = 0;
        valueString.textContent = num;
        equals.disabled = false;
        operators.forEach((operator) => operator.disabled = false);
    }
}
function clearValues() {
    // If the user divides by zero and then clears their work, re-enable the operator and equals buttons
    //      to allow for future operations to work with valid inputs
    if (num === Infinity) {
        equals.disabled = false;
        operators.forEach((operator) => operator.disabled = false);
    }
    // Empty the numArray so that no values or operators currently exist
    numArray.length = 0;

    // Reset the num variable after clearing the calculator so that future operations are not impacted by it
    num = 0;

    // Show "0" in the display area
    valueString.textContent = "0";
}
// Select each of the buttons that holds a digit (0-9)
// Add an event listener to each digit button in order to display values to the user
//      and store them for performing operations
digits.forEach((digit) => {
    digit.addEventListener("click", getValueInput);
    
    // Select each of the operator buttons (*,/,-,+)
    // Add an event listener to each operator button in order to store them for performing operations
    operators.forEach((operator) => {
        operator.addEventListener("click", getOperatorInput);
    });

    // Add an event listener to the Equals button (=) to perform the current operation
    equals.addEventListener("click", getCalcInput);

    // Add an event listener to the All Clear button (AC) to reset the calculator and end any ongoing operations
    clearAll.addEventListener("click", getClearInput);
});
// Add event listeners to support keyboard entries by the user
window.addEventListener("keydown", getValueInput);
window.addEventListener("keydown", getOperatorInput);
window.addEventListener("keydown", getCalcInput);
window.addEventListener("keydown", getClearInput);