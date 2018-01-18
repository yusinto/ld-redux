(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'ldclient-js', 'lodash/camelCase', 'uuid', 'ip', 'ua-parser-js', './actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('ldclient-js'), require('lodash/camelCase'), require('uuid'), require('ip'), require('ua-parser-js'), require('./actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ldclientJs, global.camelCase, global.uuid, global.ip, global.uaParserJs, global.actions);
    global.init = mod.exports;
  }
})(this, function (exports, _ldclientJs, _camelCase, _uuid, _ip, _uaParserJs, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _ldclientJs2 = _interopRequireDefault(_ldclientJs);

  var _camelCase2 = _interopRequireDefault(_camelCase);

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

  // initialise flags with default values in ld redux store
  var initFlags = function initFlags(flags, reduxStore) {
    var flagValues = {};
    for (var flag in flags) {
      var camelCasedKey = (0, _camelCase2.default)(flag);
      flagValues[camelCasedKey] = flags[flag];
    }
    reduxStore.dispatch((0, _actions.setFlags)(flagValues));
  };

  // set flags with real values from ld server
  var setFlags = function setFlags(flags, reduxStore) {
    var flagValues = {};
    for (var flag in flags) {
      var camelCasedKey = (0, _camelCase2.default)(flag);
      flagValues[camelCasedKey] = ldClient.variation(flag, flags[flag]);
    }
    reduxStore.dispatch((0, _actions.setFlags)(flagValues));
  };

  var subscribeToChanges = function subscribeToChanges(flags, reduxStore) {
    var _loop = function _loop(flag) {
      var camelCasedKey = (0, _camelCase2.default)(flag);
      ldClient.on('change:' + flag, function (current) {
        var newFlagValue = {};
        newFlagValue[camelCasedKey] = current;
        reduxStore.dispatch((0, _actions.setFlags)(newFlagValue));
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
        reduxStore = _ref.reduxStore,
        flags = _ref.flags,
        user = _ref.user,
        options = _ref.options;

    initFlags(flags, reduxStore);

    if (!user) {
      user = initUser();
    }

    window.ldClient = _ldclientJs2.default.initialize(clientSideId, user, options);
    window.ldClient.on('ready', function () {
      setFlags(flags, reduxStore);
      subscribeToChanges(flags, reduxStore);
    });
  };
});