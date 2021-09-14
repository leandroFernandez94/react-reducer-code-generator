# React Reducer Code Generator

#### Avoid writing actions and a long switch reducer in your React application just by providing your initial state object. 

```javascript
  import ReactReducerCodeGenerator from 'react-reducer-code-generator'

  const initialState = {
    prop1: true,
    anotherProp: 50,
    deepProp: {
      prop2: "Lorem ipsum",
      prop3: [false, true],
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
  'SET_DEEP_PROP',
  'SET_DEEP_PROP__PROP2',
  'SET_DEEP_PROP__PROP3',
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
  deepProp: {
    prop2: "Lorem ipsum",
    prop3: [false, true],
  },
  lastProp: "last one",
}

const {actions, reducer} = ReactReducerCodeGenerator(initialState)

export default function MyStatefulComponent() {
  const [state, dispatch] = useReducer(reducer, initialState)

  function handleClick() {
  // SET_PROP1 is provided in the "actions" array
    dispatch({
      type: 'SET_PROP1',
      payload: !state.prop1
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Modify prop1!</button>
    </div>
  )
}
```