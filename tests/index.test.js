import RRCG from "../src";

describe("when state is an empty object", () => {
  const state = {};
  it("should only return SET_STATE action", () => {
    const [actions] = RRCG(state);
    expect(actions).toHaveLength(1);
    expect(actions[0]).toBe("SET_STATE");
  });
});

describe("when state is a primitive value", () => {
  let state = "test";
  it("should only return SET_STATE action", () => {
    let result = RRCG(state);
    let actions = result[0];
    expect(actions).toHaveLength(1);
    expect(actions[0]).toBe("SET_STATE");

    state = 4;
    result = RRCG(state);
    actions = result[0];
    expect(actions).toHaveLength(1);
    expect(actions[0]).toBe("SET_STATE");

    state = true;
    result = RRCG(state);
    actions = result[0];
    expect(actions).toHaveLength(1);
    expect(actions[0]).toBe("SET_STATE");
  });
});

describe("when initial state is an object with one level deep properties", () => {
  const initialState = {
    a: 1,
    b: 1,
  };
  let [actions, reducer] = RRCG(initialState);

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
