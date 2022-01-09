import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0 };

// 앱의 상태에 따라 원하는 시점에 스토어의 상태를 바꿔줄 함수이다.
function updater(state, data) {
  return { ...state, count: state.count + data}; // 스토어의 처음 state는 primitive type이므로 return을 한 값을 다시 스토어의 state로 바꿔야한다.
}

const store = createStore(INITIAL_STATE, updater);

console.log(store.getState());
store.doUpdater(4)
store.doUpdater(7)
console.log(store.getState());
