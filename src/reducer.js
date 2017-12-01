import Constants from './constants';

const defaultState = {
  isLDReadyClient: false,
  isLDReadyServer: false,
};

export default function ldReducer(state = defaultState, action) {
  switch (action.type) {
    case Constants.LD_READY:
      return Object.assign({}, state, {isLDReadyClient: true});

    case Constants.SET_FLAGS:
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}