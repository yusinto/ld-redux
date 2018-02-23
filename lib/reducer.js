'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ldReducer;
function ldReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case 'SET_FLAGS':
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}