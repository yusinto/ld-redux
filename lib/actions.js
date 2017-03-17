(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './constants'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./constants'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.constants);
    global.actions = mod.exports;
  }
})(this, function (exports, _constants) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setFlags = exports.setLDReady = undefined;

  var _constants2 = _interopRequireDefault(_constants);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var setLDReady = exports.setLDReady = function setLDReady() {
    return {
      type: _constants2.default.LD_READY
    };
  };

  var setFlags = exports.setFlags = function setFlags(flags) {
    return {
      type: _constants2.default.SET_FLAGS,
      data: flags
    };
  };
});