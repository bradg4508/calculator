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
let equalsOperatingNum = 0;

const valueString = document.querySelector("#value");
const digits = document.querySelectorAll("#digits button");
const operators = document.querySelectorAll("#operators button");
const equals = document.querySelector("#equals button");
const clearAll = document.querySelector("#clear button");

function setValue(e) {
    // Reset the display area to only include the next value entered by the user
    // If you don't reset, every successive value will inaccurately include the 
    //      previously entered value
    if (num === "") {
        valueString.textContent = "";
    }
    // It allows the user to continue performing operations with accurate results
    // The variable count is arbitrary and only needed to indicate that an operation has occurred
    if (count === 1) {
        // If the user presses the Equals button consecutively more than once,
        //      the numArray will only include the number once
        numArray.splice(0, 1);
        // Reset the display area if the user wants to enter a value 
        //      and start performing a different operation
        valueString.textContent = "";
    }
    // Get the value from the user's button presses as a string from the button's textContent
    valueString.textContent += e.target.textContent;

    // Display the value in a div above the calculator buttons
    num = +valueString.textContent;

    // Reset the count variable to allow for successive operations to be performed
    //      after one has already been completed
    count = 0;
}
function setOperator(e) {
    // Add the value that was previously entered once the user presses an operator button
    if (num !== "") {
        numArray.push(num);
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
    console.log(numArray);
    // If the user enters a value, presses the Equals button, and then re-enters the same value,
    //      the num variable resets to an empty string to avoid adding it on to the display area's current value
    if (numArray.length === 1) {
        num = "";
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
    // If the user presses the Equals button after entering a value and an operation,
    //      the first operation will be performed as follows: (num) (operator) (num)
    if (numArray.length === 2) {
        if (typeof numArray[1] === "string") {
            numArray.push(+valueString.textContent);
            // If the user continues the pattern of pressing an operator and then the Equals button,
            //      the numArray will add the appropriate values in the right order 
            //      to be ready for any successive calculations
        } else if ((numArray[0] === numArray[1])) {
            numArray.splice(1, 1);
            numArray.push(numArray[0]);
        }
    }
    console.log(numArray);
    // Check to see if the numArray has at least three elements (3 elements are needed to perform an operation)
    if (numArray.length >= 3) {
        // Display the current answer to an operation
        // Keep the unrounded values present in the numArray by setting the num variable back to total
        //      so that future operations are calculated properly
        // Change the count variable to allow the user to repeatedly press the Equals button without
        //      it affecting the elements in the numArray
        equalsOperatingNum = numArray[(numArray.length - 1)];
        num = performOperation();
        valueString.textContent = num;
        num = total;
        count = 1; 
    }
}
function clearValues() {
    // Empty the numArray so that no values or operators currently exist
    numArray.length = 0;

    // Reset the num variable after clearing the calculator so that future operations are not impacted by it
    num = "";

    // Show an empty string in the display area
    valueString.textContent = "";
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