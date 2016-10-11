'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ldclientJs = require('ldclient-js');

var _ldclientJs2 = _interopRequireDefault(_ldclientJs);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userAgentParser = new _uaParserJs2.default();
var isMobileDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'mobile';
var isTabletDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'tablet';

exports.default = function (clientSideId, reduxStore, user) {
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
      key: _nodeUuid2.default.v4(),
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