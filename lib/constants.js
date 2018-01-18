(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'keymirror'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('keymirror'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.keymirror);
    global.constants = mod.exports;
  }
})(this, function (exports, _keymirror) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _keymirror2 = _interopRequireDefault(_keymirror);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _keymirror2.default)({
    SET_FLAGS: null
  });
});