type State = {
  count: number;
};

const initialState: State = {
  count: 0,
};

const globalReducer = (
  state = initialState,
  action: { type: string },
): State => {
  switch (action.type) {
    // case INCREMENT:
    //   return {
    //     ...state,
    //     count: state.count + 1,
    //   };
    // case DECREMENT:
    //   return {
    //     ...state,
    //     count: state.count - 1,
    //   };
    default:
      return state;
  }
};

export default globalReducer;
