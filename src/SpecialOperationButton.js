import { ACTIONS } from './App'

export default function SpecialOperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CHOOSE_SPECIAL_OPERATION, payload: { operation } })}
    >
      {operation}
  </button>
  )
}