'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ldConnect = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _reducer2 = require('./reducer');

var _reducer3 = _interopRequireDefault(_reducer2);

var _decorator = require('./decorator');

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getFlags = function getFlags(state, flags) {
  var ldState = state.LD;
  var c = {};

  if (flags) {
    for (var key in flags) {
      var camelCaseKey = (0, _camelCase2.default)(key);
      var stateValue = ldState[camelCaseKey];
      c[camelCaseKey] = typeof stateValue === 'undefined' ? flags[key] : stateValue;
    }
  }

  return (0, _extends3.default)({
    isLDReady: ldState.isLDReady
  }, c);
};

var ldConnect = exports.ldConnect = _decorator2.default;

exports.default = {
  init: _init2.default,
  getFlags: getFlags,
  reducer: function reducer() {
    return _reducer3.default;
  }
};