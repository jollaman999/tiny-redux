import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0 };

const store = createStore(INITIAL_STATE);

store.count = 3;
console.log(store)