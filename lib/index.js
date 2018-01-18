'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _reducer2 = require('./reducer');

var _reducer3 = _interopRequireDefault(_reducer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  init: _init2.default,
  reducer: function reducer() {
    return _reducer3.default;
  }
};