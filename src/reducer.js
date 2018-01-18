export default function ldReducer(state = {}, action) {
  switch (action.type) {
    case 'SET_FLAGS':
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}