## REDUX 만들어보며 이해하기
> The RED : 김민태 React와 Redux로 구현하는 아키텍쳐와 리스크 관리

**0. pre think!**

리덕스는 어떤 컨셉으로 이루어져있을까?

최초의 전역스토어(store)를 가지고 있다.<br/>
스토어는 컴포넌트가 어떤 상태를 필요로 하는지 알 수 없고, 컴포넌트는 자신에게 필요한 상태를 알아서 가지고 온다.<br/>

리덕스의 핵심적인 부분은 store이다.<br/>
각각의 컴포넌트들은 전역 스토어에서 상태를 가져올 수 있는데
수정 시에 직접 수정을 하면 직접 스토어의 상태를 수정을 하면 에러가 발생 했을 때 디버깅도 어렵고 관리가 힘들기 때문에</br>
어떠한 트리거가 발생되길 기다렸다가 해당 트리거가 발생 했을 때 스토어의 값을 변경하는 것은 한 곳에서 관리하도록 한다.<br/>
리덕스 입장에서는 상태를 어떻게 변경해야할 지는 알 수 없다.<br/>
스토어의 상태에 대한 디자인은 바꾸고 싶은 컴포넌트가 함수를 전달하여 수정 시점에 리덕스가 호출해주는 형태로 구현이 되어있다.

**1. 리덕스 기본**

```javascript
// redux.js
export function createStore(INITIAL_STATE) {
  let state;

  if (!state) {
    state = INITIAL_STATE;
  }

  return state;
}
```

```javascript
// index.js
import { createStore } from './redux.js';

const INITIAL_STATE = { count: 0 };

const store = createStore(INITIAL_STATE);

store.count = 3;
console.log(store)
```

스토어를 생성하는 createStore 함수를 정의한다.<br/>
스토어의 데이터가 어떻게 구성되어야 하는지는 사용자가 전달해주어야 알 수 있다.<br/>
그래서 스토어를 생성할 때 사용자가 스토어의 초기값을 전달을 해준다.<br/>
그리고 생성된 스토어를 통해 사용자는 생성하고 스토어의 값을 사용할 수 있게 된다.
