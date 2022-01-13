import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0, users: [], post: {}, todo: {} };
const ADD = 'ADD';
const SUBTRACT = 'SUBTRACT';
const SET_USERS = 'SET_USERS';
const GET_USERS = 'GET_USERS';
const SET_POST = 'SET_POST';
const GET_POST = 'GET_POST';
const SET_TODO = 'SET_TODO';

function actionCreator(type, payload) {
  return { type, payload };
}

const middleware0 = state => dispatch => action => {
  console.log('middleware0');
  if (typeof action === 'function') {
    action(dispatch);
    return;
  }
  dispatch(action);
}

const middleware1 = state => dispatch => action => {
  console.log('middleware1');
  switch (action.type) {
    case GET_USERS:
      fetch('https://jsonplaceholder.typicode.com/users/')
        .then(response => response.json())
        .then(users => {
          return dispatch(actionCreator(SET_USERS, users));
        });
      break;
    default:
      dispatch(action);
  }
}

const middleware2 = state => dispatch => action => {
  console.log('middleware2');
  switch (action.type) {
    case GET_POST:
      fetch(`https://jsonplaceholder.typicode.com/posts/${action.payload}`)
        .then(response => response.json())
        .then(post => {
          return dispatch(actionCreator(SET_POST, post));
        });
      break;
    default:
      dispatch(action);
  }
}

const middleware3 = state => dispatch => action => {
  console.log('middleware3');
  if (typeof action === 'function') {
    action(dispatch);
    return;
  }
  dispatch(action);
}

// 앱의 상태에 따라 원하는 시점에 스토어의 상태를 바꿔줄 함수이다.
function reducer(state, action) {
  switch (action.type) {
    case ADD:
      return { ...state, count: state.count + action.payload };
    case SUBTRACT:
      return { ...state, count: state.count - action.payload };
    case SET_USERS:
      return { ...state, users: action.payload };
    case SET_POST:
      return { ...state, post: action.payload };
    case SET_TODO:
      return { ...state, todo: action.payload };
    default:
      console.log('해당 액션은 정의되지 않았습니다.');
      return state;
  }
}

const store = createStore(INITIAL_STATE, reducer, [
  middleware0,
  // middleware1,
  // middleware2
]);

function listener() {
  console.log(store.getState());
}

function add(data) {
  store.dispatch(actionCreator(ADD, data));
}

function subtract(data) {
  store.dispatch(actionCreator(SUBTRACT, data));
}

store.subscribe(listener);
add(4);
subtract(7);

store.dispatch(actionCreator(GET_USERS));
store.dispatch(actionCreator(GET_POST, 1));
store.dispatch(actionCreator(GET_POST, 2));

const fetchTodos = id => dispatch => {
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then(response => response.json())
    .then(todo => {
       dispatch(actionCreator(SET_TODO, todo));
    });
}

store.dispatch(fetchTodos(3));