'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = ldReducer;

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = {
  isLDReady: false
};

function ldReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case _constants2.default.LD_READY:
      return (0, _assign2.default)({}, state, { isLDReady: true });

    case _constants2.default.SET_FLAGS:
      return (0, _assign2.default)({}, state, action.data);

    default:
      return state;
  }
}