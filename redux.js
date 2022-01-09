export function createStore(INITIAL_STATE) {
  let state;

  if (!state) {
    state = INITIAL_STATE;
  }

  function getState() {
    return state;
  }

  return {
    getState, // state를 바로 반환할 경우 값을 직접 참조하게 되므로 getter를 반환한다.
  }
}