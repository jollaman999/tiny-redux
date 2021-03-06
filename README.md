## REDUX 만들어보며 이해하기
> The RED : 김민태 React와 Redux로 구현하는 아키텍쳐와 리스크 관리

**0. pre think!**

리덕스는 어떤 컨셉으로 이루어져있을까?

최초의 전역스토어(store)를 가지고 있다.<br/>
스토어는 컴포넌트가 어떤 상태를 필요로 하는지 알 수 없고, 컴포넌트는 자신에게 필요한 상태를 알아서 가지고 온다.<br/>

리덕스의 핵심적인 부분은 store이다.<br/>
각각의 컴포넌트들은 전역 스토어에서 상태를 가져올 수 있는데
수정 시에 직접 수정을 하면 직접 스토어의 상태를 수정을 하면 에러가 발생 했을 때 디버깅도 어렵고 관리가 힘들기 때문에<br/>
어떠한 트리거가 발생되길 기다렸다가 해당 트리거가 발생 했을 때 스토어의 값을 변경하는 것은 한 곳에서 관리하도록 한다.<br/>
리덕스 입장에서는 상태를 어떻게 변경해야할 지는 알 수 없다.<br/>
스토어의 상태에 대한 디자인은 바꾸고 싶은 컴포넌트가 함수를 전달하여 수정 시점에 리덕스가 호출해주는 형태로 구현이 되어있다.

**1. 리덕스 기본**

```javascript
// redux.js
export function createStore(INITIAL_STATE, updater) {
  let state;

  if (!state) {
    state = INITIAL_STATE;
  }

  function doUpdater(data) {
    // state 변경을 앱이 원하는 시점에서 실행할 수 있도록 반환하는 state 변경 함수이다.
    state = updater(state, data);
  }

  function getState() {
    return state;
  }

  return {
    doUpdater,
    getState, // state를 바로 반환할 경우 값을 직접 참조하게 되므로 getter를 반환한다.
  };
}
```

```javascript
// index.js
import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0 };

// 앱의 상태에 따라 원하는 시점에 스토어의 상태를 바꿔줄 함수이다.
function updater(state, data) {
  return { ...state, count: state.count + data }; // 스토어의 처음 state는 primitive type이므로 return을 한 값을 다시 스토어의 state로 바꿔야한다.
}

const store = createStore(INITIAL_STATE, updater);

console.log(store.getState());
store.doUpdater(4);
store.doUpdater(7);
console.log(store.getState());
```

스토어를 생성하는 createStore 함수를 정의한다.<br/>
스토어의 데이터가 어떻게 구성되어야 하는지는 사용자가 전달해주어야 알 수 있다.<br/>
그래서 스토어를 생성할 때 사용자가 스토어의 초기값을 전달을 해준다.<br/>
그리고 생성된 스토어를 통해 사용자는 생성하고 스토어의 값을 사용할 수 있게 된다.

**2. 리덕스 형태로 변경**

updater => reducer
doUpdate => dispatch
date => action : 주로 { type: 'blabla', payload: 'blabla' } 형태의 컨벤션을 가지고 있다.

```javascript
// redux.js
export function createStore(INITIAL_STATE, reducer) {
  let state;

  if (!state) {
    state = INITIAL_STATE;
  }

  function dispatch(action) {
    // state 변경을 앱이 원하는 시점에서 실행할 수 있도록 반환하는 state 변경 함수이다.
    state = reducer(state, action);
  }

  function getState() {
    return state;
  }

  return {
    dispatch,
    getState, // state를 바로 반환할 경우 값을 직접 참조하게 되므로 getter를 반환한다.
  }
}
```

```javascript
// index.js
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
```

스토어는 리덕스가 제공하는 도구들을 모아놓은 일종의 도구 박스 같다.
상태를 바꾸기 위해 사용자가 요청할 때 사용하기위한 dispatch 함수, store 안의 상태를 갖기위한 getState 함수를 가지고 있다.

**3. 스토어 구독**

여기까지 보면 store에 dispatch 후에 getState를 하는 시점을 컴포넌트가 알고 있어서 상태를 가져올 수 있었다.<br/>
그런데 스토어는 다른 앱도 함께 사용하는 전역 객체인데 다른 컴포넌트가 dispatch 했을 때는 어떻게 알 수 있을까.<br/>
그래서 console.log(store.getState()); 부분을 스토어의 상태가 바뀌었을 때 실행 되도록 변경해본다.<br/>

이는 마치 우리가 이벤트 시스템에서 어떤 버튼에 클릭 이벤트 핸들러를 직접 달아주는 것과 비슷하게 동작해야한다.<br/>
언제 사용자가 버튼을 클릭할 지 알 수 없기 때문이다.<br/>
이러한 패턴을 소프트웨어 아키텍쳐에서 pub sub 패턴이라고 한다.<br/>
사건이 발생하면 구독자에게 전달해주는 형태의 패턴이다.

```javascript
// redux.js
export function createStore(INITIAL_STATE, reducer) {
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

  return {
    dispatch,
    getState, // state를 바로 반환할 경우 값을 직접 참조하게 되므로 getter를 반환한다.
    subscribe,
  };
}
```

```javascript
import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0 };

// 앱의 상태에 따라 원하는 시점에 스토어의 상태를 바꿔줄 함수이다.
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, count: state.count + action.payload };
    case 'SUBTRACT':
      return { ...state, count: state.count - action.payload };
    default:
      console.log('해당 액션은 정의되지 않았습니다.');
  }
}

const store = createStore(INITIAL_STATE, reducer);

function listener() {
  console.log(store.getState());
}

store.subscribe(listener);
store.dispatch({ type: 'ADD', payload: 4 });
store.dispatch({ type: 'SUBTRACT', payload: 7 });
```

**4. 액션 다루기**

actionCreator와 action상수를 생성하여 반복적인 코드를 축약한다.

```javascript
// index.js
import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0 };
const ADD = 'ADD';
const SUBTRACT = 'SUBTRACT';

// 앱의 상태에 따라 원하는 시점에 스토어의 상태를 바꿔줄 함수이다.
function reducer(state, action) {
  switch (action.type) {
    case ADD:
      return { ...state, count: state.count + action.payload};
    case SUBTRACT:
      return { ...state, count: state.count - action.payload};
    default:
      console.log('해당 액션은 정의되지 않았습니다.')
  }
}

const store = createStore(INITIAL_STATE, reducer);

function listener() {
  console.log(store.getState());
}

function actionCreator(type, payload) {
  return { type, payload };
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
```

**5. 비동기 액션 다루기**

만약에 액션이 비동기으로 store 상태를 바꾸고자 한다면 어떻게 할까<br/>
우선은 비동기적인 액션을 만들어보자.

```javascript
import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0, users: [] };
const ADD = 'ADD';
const SUBTRACT = 'SUBTRACT';
const SET_USERS = 'SET_USERS';

function actionCreator(type, payload) {
  return { type, payload };
}

// 앱의 상태에 따라 원하는 시점에 스토어의 상태를 바꿔줄 함수이다.
function reducer(state, action) {
  switch (action.type) {
    case ADD:
      return { ...state, count: state.count + action.payload };
    case SUBTRACT:
      return { ...state, count: state.count - action.payload };
    case SET_USERS:
      return { ...state, count: state.users - action.payload };
    default:
      console.log('해당 액션은 정의되지 않았습니다.');
      return state;
  }
}

const store = createStore(INITIAL_STATE, reducer);

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
store.dispatch(actionCreator(SET_USERS));

```

비동기 액션인 GET_USERS를 만들었고 액션이 정상적으로 동작하였지만, 스토어의 상태는 생각했던 것처럼 업데이트 되지 않는다.
따라서 비동기 액션을 처리하기 위해거는 다른 무언가가 필요하다는 것을 알 수 있다. (자바스크립트 특성)

**6. middleware 구현**

리덕스 자체만으로는 비동기 작업을 처리 할 수 없다.<br/>
reducer에 FETCH 액션을 처리하는 코드를 넣어 주었다 하더라도 상태값을 가져오는 로직은 비동기 적으로 이루어지지 않는다.
따라서 리듀서의 동기적인 흐름이외에 여러가지 기능을 할수 있도록 리덕스에서 바깥쪽을 노출하고 있는 아키텍쳐인 미들웨어를 활용한다.

```javascript
// index.js
import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0, users: [] };
const ADD = 'ADD';
const SUBTRACT = 'SUBTRACT';
const SET_USERS = 'SET_USERS';
const GET_USERS = 'GET_USERS';

function actionCreator(type, payload) {
  return { type, payload };
}

const middleware = state => dispatch => action => {
  switch (action.type) {
    case GET_USERS:
      fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {
          return dispatch(actionCreator(SET_USERS, users));
        });
      break;
    default:
      dispatch(action);
      return state;
  }
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
    default:
      console.log('해당 액션은 정의되지 않았습니다.');
      return state;
  }
}

const store = createStore(INITIAL_STATE, reducer, middleware);

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
```

사용자가 미들웨어를 생성하여 미들웨어에서 비동기 액션을 처리한다. 미들웨어는 삼단 함수로 구현한다.<br/>
미들웨어는 스토어의 내부에서 state와 dispatch를 인자로 받아서 실행되고 action을 인자로 받는 함수를 반환한다.<br/>
이 반환된 함수가 스토어의 진짜 dispatch를 대신하여 컴포넌트가 사용할 dispatch 함수로 반환된다.<br/>
그리고 컴포넌트가 dispatch 할 때 비동기 액션은 미들웨어에서 처리되고 처리되지 않은 액션들은 진짜 dispatch에 전달된다.

```javascript
// index.js
import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0, users: [] };
const ADD = 'ADD';
const SUBTRACT = 'SUBTRACT';
const SET_USERS = 'SET_USERS';
const GET_USERS = 'GET_USERS';

function actionCreator(type, payload) {
  return { type, payload };
}

const middleware = state => dispatch => action => {
  switch (action.type) {
    case GET_USERS:
      fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {
          return dispatch(actionCreator(SET_USERS, users));
        });
      break;
    default:
      dispatch(action);
      return state;
  }
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
    default:
      console.log('해당 액션은 정의되지 않았습니다.');
      return state;
  }
}

const store = createStore(INITIAL_STATE, reducer, middleware);

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
```

**7. 다중 middleware 처리 구현**

이제 여러개의 미들웨어를 추가해보자.<br/>
users를 받아오는 미들웨어 외에 post를 받아오는 미들웨어를 구현하여 createStore 함수에 전달한다.<br/>

마지막 미들웨어는 스토어의 dispatch를 실행하여야 한다.<br/>
따라서 스토어에서 받아온 미들웨어 배열을 뒤집어서 dispatch 함수를 마지막 미들웨어에게 전달한다.<br/>
그리고 다른 미들웨어들은 다음의 미들웨어를 호출하는 함수를 dispatch 함수 대신 전달 받아서 실행하게 된다.<br/>

```javascript
// index.js
import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0, users: [], post: {} };
const ADD = 'ADD';
const SUBTRACT = 'SUBTRACT';
const SET_USERS = 'SET_USERS';
const GET_USERS = 'GET_USERS';
const SET_POST = 'SET_POST';
const GET_POST = 'GET_POST';

function actionCreator(type, payload) {
  return { type, payload };
}

const middleware1 = state => dispatch => action => {
  console.log('middleware1');
  switch (action.type) {
    case GET_USERS:
      fetch('https://jsonplaceholder.typicode.com/users')
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
    default:
      console.log('해당 액션은 정의되지 않았습니다.');
      return state;
  }
}

const store = createStore(INITIAL_STATE, reducer, [middleware1, middleware2]);

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
```

```javascript
// redux.js
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
```

**8. 비동기 액션을 실행해주는 Middleware 구현**

위에서 구현한 미들웨어는 reducer가 동기 액션을 처리하는 것처럼 비동기 액션을 직접 처리하는 미들웨어였다.<br/>
그렇지만, 리덕스의 미들웨어로 주로 사용하는 redux-thunk 미들웨어는 비동기 액션을 직접 처리 하지 않는다.<br/>
redux-thunk 처럼 middleware0를 구현해보자.<br/>
middleware0는 action이 function 타입일 때 비동기 액션으로 간주하고 해당 액션의 인자로 dispatch를 넘겨준다.<br/>
비동기 액션 함수는 dispatch를 인자로 받는 함수를 반환하는 형태로 작성한다.

```javascript
// index.js
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
```