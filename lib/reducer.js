'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ldReducer;
function ldReducer(state, action) {
  switch (action.type) {
    case 'SET_FLAGS':
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}