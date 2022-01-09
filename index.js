import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0 };

// 앱의 상태에 따라 원하는 시점에 스토어의 상태를 바꿔줄 함수이다.
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, count: state.count + action.payload};
    case 'SUBTRACT':
      return { ...state, count: state.count - action.payload};
    default:
      console.log('해당 액션은 정의되지 않았습니다.')
  }
}

const store = createStore(INITIAL_STATE, reducer);

console.log(store.getState());
store.dispatch({type: 'ADD', payload: 4})
store.dispatch({type: 'SUBTRACT', payload: 7})
console.log(store.getState());
