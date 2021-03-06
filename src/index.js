function mapPropNameToActionName(propName, value, prefix = "") {
  const upperVersion = propName.replace(/([A-Z])/g, "_$1").toUpperCase();
  const actionName = `${prefix ? prefix : ""}${upperVersion}`;

  const propnameSetter = `SET_${actionName}`;

  if (typeof value !== "object" || Array.isArray(value)) {
    return [propnameSetter];
  }

  const childPropNames = Object.keys(value);
  return [
    propnameSetter,
    childPropNames.flatMap((childProp) =>
      mapPropNameToActionName(childProp, value[childProp], `${actionName}__`)
    ),
  ].flat();
}

function generateActions(state) {
  // only one action if state is a number/string/boolean/array
  if (typeof state !== "object") {
    return ["SET_STATE"];
  }

  const propsNames = Object.keys(state);

  if (!propsNames.length) return ["SET_STATE"];
  return propsNames.flatMap((propName) =>
    mapPropNameToActionName(propName, state[propName])
  );
}

function getPathFromActionString(actionString) {
  const path = actionString.toLowerCase().split("__");
  path[0] = path[0].split("set_")[1];
  return path.map((pathStep) =>
    pathStep.replace(/_(.{1})/g, (_, letter) => letter.toUpperCase())
  );
}

function generateReducerFn(actions) {
  const reducers = actions.reduce((acum, actionString) => {
    const path = getPathFromActionString(actionString);
    const actionReducer = (state, payload, reducerHandler) => {
      let newState = { ...state };

      path.reduce((acc, key, i) => {
        if (acc[key] === undefined) acc[key] = {};
        if (i === path.length - 1) {
          const currentValue = acc[key];
          acc[key] = reducerHandler
            ? reducerHandler(currentValue, payload)
            : payload;
        }
        return acc[key];
      }, newState);

      return newState;
    };

    acum[actionString] = actionReducer;
    return acum;
  }, {});

  return (state, { type, payload, reducerHandler }) => {
    return reducers[type]
      ? reducers[type](state, payload, reducerHandler)
      : state;
  };
}

function reactReducerCodeGenerator(initialState) {
  const actions = generateActions(initialState);
  const reducer = generateReducerFn(actions);

  return { actions, reducer };
}

export default reactReducerCodeGenerator;
