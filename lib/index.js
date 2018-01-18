(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './init', './reducer'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./init'), require('./reducer'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.init, global.reducer);
    global.index = mod.exports;
  }
})(this, function (exports, _init, _reducer2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _init2 = _interopRequireDefault(_init);

  var _reducer3 = _interopRequireDefault(_reducer2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    init: _init2.default,
    reducer: function reducer() {
      return _reducer3.default;
    }
  };
});