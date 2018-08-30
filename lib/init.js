'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ldclientJs = require('ldclient-js');

var _ldclientJs2 = _interopRequireDefault(_ldclientJs);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userAgentParser = new _uaParserJs2.default();
var isMobileDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'mobile';
var isTabletDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'tablet';

// initialise flags with default values in ld redux store
var initFlags = function initFlags(flags, dispatch) {
  var flagValues = { isLDReady: false };
  for (var flag in flags) {
    var camelCasedKey = (0, _camelCase2.default)(flag);
    flagValues[camelCasedKey] = flags[flag];
  }
  dispatch((0, _actions.setFlags)(flagValues));
};

// set flags with real values from ld server
var setFlags = function setFlags(flags, dispatch) {
  var flagValues = { isLDReady: true };
  for (var flag in flags) {
    var camelCasedKey = (0, _camelCase2.default)(flag);
    flagValues[camelCasedKey] = ldClient.variation(flag, flags[flag]);
  }
  dispatch((0, _actions.setFlags)(flagValues));
};

var subscribeToChanges = function subscribeToChanges(flags, dispatch) {
  var _loop = function _loop(flag) {
    var camelCasedKey = (0, _camelCase2.default)(flag);
    ldClient.on('change:' + flag, function (current) {
      var newFlagValue = {};
      newFlagValue[camelCasedKey] = current;
      dispatch((0, _actions.setFlags)(newFlagValue));
    });
  };

  for (var flag in flags) {
    _loop(flag);
  }
};

var initUser = function initUser() {
  var device = void 0;

  if (isMobileDevice) {
    device = 'mobile';
  } else if (isTabletDevice) {
    device = 'tablet';
  } else {
    device = 'desktop';
  }

  return {
    key: _uuid2.default.v4(),
    ip: _ip2.default.address(),
    custom: {
      browser: userAgentParser.getResult().browser.name,
      device: device
    }
  };
};

exports.default = function (_ref) {
  var clientSideId = _ref.clientSideId,
      dispatch = _ref.dispatch,
      flags = _ref.flags,
      user = _ref.user,
      options = _ref.options,
      settings = _ref.settings;

  initFlags(flags, dispatch);

  if (!user) {
    user = initUser();
  }

  window.ldClient = _ldclientJs2.default.initialize(clientSideId, user, options);
  window.ldClient.on('ready', function () {
    if (settings && settings.allFlags) {
      var allFlags = ldClient.allFlags();
      flags = _extends({}, flags, allFlags);
    }
    setFlags(flags, dispatch);
    subscribeToChanges(flags, dispatch);
  });
};