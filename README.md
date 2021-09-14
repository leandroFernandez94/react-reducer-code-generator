# React Reducer Code Generator

#### Avoid writing actions and a long switch reducer in your React application just by providing your initial state object. 


##### code example https://codesandbox.io/s/react-reducer-code-generator-example-9qjzh

```javascript
  import ReactReducerCodeGenerator from 'react-reducer-code-generator'

  const initialState = {
    prop1: true,
    anotherProp: 50,
    objectProp: {
      deepProp: "Lorem ipsum",
      prop2: [false, true],
    },
    lastProp: "last one",
  }

  const {actions, reducer} = ReactReducerCodeGenerator(initialState)
```

this will provide you with an actions array with the shape of:

```javascript
[
  'SET_PROP1',
  'SET_ANOTHER_PROP',
  'SET_OBJECT_PROP',
  'SET_OBJECT_PROP__DEEP_PROP',
  'SET_OBJECT_PROP__PROP2',
  'SET_LAST_PROP'
]
```

that way we can apply actions in a react context like this:

```javascript
import React, {useReducer} from 'react'
import ReactReducerCodeGenerator from 'react-reducer-code-generator'

const initialState = {
  prop1: true,
  anotherProp: 50,
  objectProp: {
    deepProp: "Lorem ipsum",
    prop2: [false, true],
  },
  lastProp: "last one",
}

const {actions, reducer} = ReactReducerCodeGenerator(initialState)

export default function MyStatefulComponent() {
  const [state, dispatch] = useReducer(reducer, initialState)

  function handleChangeProp1() {
    // SET_PROP1 is provided in the "actions" array
    dispatch({
      type: "SET_PROP1",
      payload: !state.prop1
    });
  }

  function handleChangeObject() {
    // you can modify objects properties

    dispatch({
      type: "SET_OBJECT_PROP",
      payload: {
        deepProp: "dolor sit amet",
        prop2: [true, false]
      }
    });
  }

  function handleChangeDeepProp() {
    // you can set deep properties and modify only their value
    //we always use the syntax SET_<FIRST_LEVEL_PROPERTY>__<DEEP_PROPERTY>__...

    dispatch({
      type: "SET_OBJECT_PROP__DEEP_PROP",
      payload: "only modify me!"
    });
  }

  
  function handleWithCustomReducer() {
    // you can also provide a reducerHandler property in the dispatch object
    // this function will receive the current property value and the payload value provided in the 
    // action
    // in this example instead of setting the payload value, we add it to the current value:
    dispatch({
      type: "SET_ANOTHER_PROP",
      payload: 2,
      reducerHandler: (currentValue, payload) => {
        return currentValue + payload;
      }
    });
  }

  return (
    <div className="App">
      <h1>ReactReducerCodeGenerator CodeSandbox</h1>
      <h2>actions generated:</h2>
      <pre>
        <code>{actions.toString()}</code>
      </pre>
      <button onClick={handleChangeProp1}>Modify prop1!</button>
      <button onClick={handleChangeObject}>Modify objectProp!</button>
      <button onClick={handleChangeDeepProp}>Modify deepProp!</button>
      <h2>current state</h2>
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
    </div>
  );
}
```