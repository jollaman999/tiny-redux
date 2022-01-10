export function createStore(INITIAL_STATE, reducer, middleware) {
  let state;
  const handler = [];

  if (!state) {
    state = INITIAL_STATE;
  }

  function dispatch(action) {
    // state 변경을 앱이 원하는 시점에서 실행할 수 있도록 반환하는 state 변경 함수이다.
    state = reducer(state, action);
    handler.forEach(listener => {
      listener();
    });
  }

  function getState() {
    return state;
  }

  function subscribe(listener) {
    handler.push(listener);
  }

  let lastDispatch = dispatch;
  middleware = Array.from(middleware).reverse();
  console.log(middleware)
  middleware.forEach(m => {
    lastDispatch = m(state)(lastDispatch);
  })

  return {
    dispatch: lastDispatch,
    getState, // state를 바로 반환할 경우 값을 직접 참조하게 되므로 getter를 반환한다.
    subscribe,
  };
}
