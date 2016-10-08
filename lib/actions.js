'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialiseFlags = exports.setLDReady = undefined;

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Stores launch darkly client object in universal state
var setLDReady = exports.setLDReady = function setLDReady() {
  return {
    type: _constants2.default.LD_READY
  };
};

var setFlags = function setFlags(flags) {
  return {
    type: _constants2.default.SET_FLAGS,
    data: flags
  };
};

var initialiseFlags = exports.initialiseFlags = function initialiseFlags(flags) {
  return function (dispatch) {
    var flagValues = {};

    var _loop = function _loop(flag) {
      var camelCasedKey = (0, _camelCase2.default)(flag);
      flagValues[camelCasedKey] = ldClient.variation(flag, flags[flag]);

      ldClient.on('change:' + flag, function (current) {
        var newFlagValues = {};
        newFlagValues[camelCasedKey] = current;

        dispatch(setFlags(newFlagValues));
      });
    };

    for (var flag in flags) {
      _loop(flag);
    }

    dispatch(setFlags(flagValues));
  };
};