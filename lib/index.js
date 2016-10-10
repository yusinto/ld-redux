'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ldConnect = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ldclientJs = require('ldclient-js');

var _ldclientJs2 = _interopRequireDefault(_ldclientJs);

var _guid = require('guid');

var _guid2 = _interopRequireDefault(_guid);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _actions = require('./actions');

var _reducer2 = require('./reducer');

var _reducer3 = _interopRequireDefault(_reducer2);

var _decorator = require('./decorator');

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userAgentParser = new _uaParserJs2.default();
var isMobileDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'mobile';
var isTabletDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'tablet';

var init = function init(clientSideId, reduxStore, user) {
  if (!user) {
    var device = void 0;

    if (isMobileDevice) {
      device = 'mobile';
    } else if (isTabletDevice) {
      device = 'tablet';
    } else {
      device = 'desktop';
    }

    user = {
      key: _guid2.default.raw(),
      ip: _ip2.default.address(),
      custom: {
        browser: userAgentParser.getResult().browser.name,
        device: device
      }
    };
  }

  window.ldClient = _ldclientJs2.default.initialize(clientSideId, user);
  window.ldClient.on('ready', function () {
    reduxStore.dispatch((0, _actions.setLDReady)());
  });
};

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
  init: init,
  getFlags: getFlags,
  reducer: function reducer() {
    return _reducer3.default;
  }
};