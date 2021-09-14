import RRCG from "../src";

describe("when state is an empty object", () => {
  const state = {};
  it("should only return SET_STATE action", () => {
    const { actions } = RRCG(state);
    expect(actions).toHaveLength(1);
    expect(actions[0]).toBe("SET_STATE");
  });
});

describe("when state is a primitive value", () => {
  let state = "test";
  it("should only return SET_STATE action", () => {
    let result = RRCG(state);
    let actions = result.actions;
    expect(actions).toHaveLength(1);
    expect(actions[0]).toBe("SET_STATE");

    state = 4;
    result = RRCG(state);
    actions = result.actions;
    expect(actions).toHaveLength(1);
    expect(actions[0]).toBe("SET_STATE");

    state = true;
    result = RRCG(state);
    actions = result.actions;
    expect(actions).toHaveLength(1);
    expect(actions[0]).toBe("SET_STATE");
  });
});

describe("when initial state is an object with one level deep properties", () => {
  const initialState = {
    a: 1,
    b: 1,
  };
  let { actions, reducer } = RRCG(initialState);

  it("should return actions for properties", () => {
    expect(actions).toHaveLength(2);
    expect(actions).toContain("SET_A");
    expect(actions).toContain("SET_B");
  });

  describe("and reducer is used on a state object to modify one property", () => {
    const stateSnapshot = {
      a: 2,
      b: 4,
    };
    const result = reducer(stateSnapshot, { type: "SET_A", payload: 45 });

    it("should return a new snapshot with that property modified", () => {
      //result has to be another variable reference, if stateSnapshot is mutated and returned, it wont work wit useReducer
      expect(result).not.toBe(stateSnapshot);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result.a).toEqual(45);
      expect(result.b).toEqual(stateSnapshot.b);
    });
  });

  describe("and reducer is used on an inexistent property", () => {
    const stateSnapshot = {
      a: 2,
      b: 4,
    };
    const result = reducer(stateSnapshot, { type: "SET_C", payload: 45 });

    it("shouldn't modify the snapshot", () => {
      expect(Object.keys(result)).toHaveLength(2);
      expect(result.a).toEqual(stateSnapshot.a);
      expect(result.b).toEqual(stateSnapshot.b);
    });
  });
});

describe("When initial state contains an array property", () => {
  const initialState = {
    a: 1,
    b: [true, false],
  };

  let { actions } = RRCG(initialState);

  it("should return only one action for the array", () => {
    expect(actions).toHaveLength(2);
    expect(actions).toContain("SET_A");
    expect(actions).toContain("SET_B");
  });
});

describe("when initial state is an object with  deep properties", () => {
  const initialState = {
    a: 1,
    b: 1,
    c: {
      d: true,
      e: false,
    },
  };
  let { actions, reducer } = RRCG(initialState);

  it("should return actions for properties", () => {
    expect(actions).toHaveLength(5);
    expect(actions).toContain("SET_A");
    expect(actions).toContain("SET_B");
    expect(actions).toContain("SET_C");
    expect(actions).toContain("SET_C__D");
    expect(actions).toContain("SET_C__E");
  });

  describe("and reducer is used to modify an object property", () => {
    const stateSnapshot = {
      a: 1,
      b: 1,
      c: {
        d: true,
        e: false,
      },
    };
    const result = reducer(stateSnapshot, {
      type: "SET_C",
      payload: { d: false, e: true },
    });

    it("should return a new snapshot with that property modified", () => {
      expect(result).not.toBe(stateSnapshot);
      expect(result.a).toEqual(1);
      expect(result.b).toEqual(1);
      expect(result.c.d).toEqual(false);
      expect(result.c.e).toEqual(true);
    });
  });
});