(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'babel-runtime/core-js/object/assign', './constants'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('babel-runtime/core-js/object/assign'), require('./constants'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.assign, global.constants);
    global.reducer = mod.exports;
  }
})(this, function (exports, _assign, _constants) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ldReducer;

  var _assign2 = _interopRequireDefault(_assign);

  var _constants2 = _interopRequireDefault(_constants);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var defaultState = {
    isLDReadyClient: false,
    isLDReadyServer: false
  };

  function ldReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments[1];

    switch (action.type) {
      case _constants2.default.LD_READY:
        return (0, _assign2.default)({}, state, { isLDReadyClient: true });

      case _constants2.default.SET_FLAGS:
        return (0, _assign2.default)({}, state, action.data);

      default:
        return state;
    }
  }
});