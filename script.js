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
let operationComplete = 0;
let equalsOperatingNum = 0;

const valueString = document.querySelector("#value");
const digits = document.querySelectorAll("#digits button");
const operators = document.querySelectorAll("#operators button");
const equals = document.querySelector("#equals button");
const clearAll = document.querySelector("#clear button");

function setValue(e) {
    // If the user divides by zero and then enters a new value, re-enable the operator and equals buttons
    //      to allow for future operations to work with valid inputs
    if (num === Infinity) {
        equals.disabled = false;
        operators.forEach((operator) => operator.disabled = false);
    }
    // Reset the display area to only include the next value entered by the user
    // If you don't reset, every successive value will inaccurately include the 
    //      previously entered value
    if (num === "" || valueString.textContent === "0") {
        valueString.textContent = "";
    }
    // It allows the user to continue performing operations with accurate results
    // The variable operationComplete is arbitrary and only needed to indicate that an operation has occurred
    if (operationComplete === 1 && (numArray.length === 1 || numArray.length === 3) && 
        e.target.textContent !== "\u2190" && e.target.textContent !== "\u00B1") {
        // If the user presses the Equals button consecutively more than once,
        //      the numArray will only include the number once
        numArray.splice(0, 1);
        // Reset the display area if the user wants to enter a value 
        //      and start performing a different operation
        valueString.textContent = "";
    }
    // Get the value from the user's button presses as a string from the button's textContent
    // For decimal entries, the display will show a 0 in the ones place
    if (e.target.textContent === ".") {
        if (num === "" || num === total) {
            valueString.textContent = "0";
        }
    }
    valueString.textContent += e.target.textContent;

    // If the user wants to change the sign of the current value, the display will show the sign change
    if (e.target.textContent === "\u00B1") {
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
    // If the user presses the backspace button, discard the most recently entered value
    //      and change the current num variable in the display area
    // If the current value is the result from a previous operation, do not let the backspace button
    //      clear any of the digits in the currently displayed value
    if (e.target.textContent === "\u2190") {
        if ((total === num && num !== 0) || valueString.textContent === "") {
            valueString.textContent = valueString.textContent.substring(0, (valueString.textContent.length - 1));
        } else {
            valueString.textContent = valueString.textContent.substring(0, (valueString.textContent.length - 2));
            if (valueString.textContent === "-" || valueString.textContent === "") {
                valueString.textContent = "0";
            }
            // Reset the operationComplete variable to allow for successive operations to be performed
            //      after one has already been completed
            operationComplete = 0;
        }
    }
    // Store the value in the display above the calculator buttons
    num = +valueString.textContent;
}
function setOperator(e) {
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
    operator = e.target.textContent;

    // Add the operator to the numArray
    numArray.push(operator);

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
        if (typeof numArray[2] === "string") {
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
    if (numArray.length >= 3) {
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
    digit.addEventListener("click", setValue);
    
    // Select each of the operator buttons (*,/,-,+)
    // Add an event listener to each operator button in order to store them for performing operations
    operators.forEach((operator) => {
        operator.addEventListener("click", setOperator);
    });

    // Add an event listener to the Equals button (=) to perform the current operation
    equals.addEventListener("click", displayCalculation);

    // Add an event listener to the All Clear button (AC) to reset the calculator and end any ongoing operations
    clearAll.addEventListener("click", clearValues);
});