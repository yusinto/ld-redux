(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'ldclient-js', 'uuid', 'ip', 'ua-parser-js', './actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('ldclient-js'), require('uuid'), require('ip'), require('ua-parser-js'), require('./actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ldclientJs, global.uuid, global.ip, global.uaParserJs, global.actions);
    global.init = mod.exports;
  }
})(this, function (exports, _ldclientJs, _uuid, _ip, _uaParserJs, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _ldclientJs2 = _interopRequireDefault(_ldclientJs);

  var _uuid2 = _interopRequireDefault(_uuid);

  var _ip2 = _interopRequireDefault(_ip);

  var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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
        key: _uuid2.default.v4(),
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
});