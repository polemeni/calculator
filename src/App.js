import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // Checks to see if the currentOperand is the output of an evaluation. If True, this will clear the output and set the currentOperand to the payload digit
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      // Edge case: Does not allow more than one decimal
      if (payload.digit == '.' && state.currentOperand.includes(".")) {
        return state
      }
      // Edge case: Doesn't allow a currentOperand to begin with 0 unless starting a decimal
      // Initial state for current operand is 0
      if (state.currentOperand == null) {
        if (payload.digit == '0' && state.previousOperand == null) {
          return state
        }
        if (payload.digit == '.') {
          return {
            ...state,
            currentOperand: `${state.currentOperand}${payload.digit}`,
          }
        }
        return {
          ...state,
          currentOperand: payload.digit,
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      // Doesn't allow an operation to be added before a digit
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      //
      if (state.currentOperand == null && state.previousOperand != null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          currentOperand: null,
          previousOperand: state.currentOperand,
          operation: payload.operation,
        }
      }

      return {
        ...state,
        currentOperand: null,
        previousOperand: evaluate(state),
        // previousOperand: 'Trigger check',
        operation: payload.operation,
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1) //Removes last digit from the currentOperand
      }
  }
};

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  // console.log("Previous Operand: ", prev)
  // console.log("Current Operand: ", current)
  if (isNaN(prev) || isNaN(current)) return ""

  let computation = ""
  switch(operation) {
    case "+":
      computation = prev + current
      // console.log("Operation", operation)
      // console.log("Computation: ", computation)
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) {
    return
  }
  const [integer, decimal] = operand.split(".")
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer)
  }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer,
    {}); // Returns an array of two items: the current state and the dispatch func

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation = '÷' dispatch={dispatch} />
      <DigitButton digit = '1' dispatch={dispatch} />
      <DigitButton digit = '2' dispatch={dispatch} />
      <DigitButton digit = '3' dispatch={dispatch} />
      <OperationButton operation = '*' dispatch={dispatch} />
      <DigitButton digit = '4' dispatch={dispatch} />
      <DigitButton digit = '5' dispatch={dispatch} />
      <DigitButton digit = '6' dispatch={dispatch} />
      <OperationButton operation = '+' dispatch={dispatch} />
      <DigitButton digit = '7' dispatch={dispatch} />
      <DigitButton digit = '8' dispatch={dispatch} />
      <DigitButton digit = '9' dispatch={dispatch} />
      <OperationButton operation = '-' dispatch={dispatch} />
      <DigitButton digit = '.' dispatch={dispatch} />
      <DigitButton digit = '0' dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
