'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ldReducer = exports.ldConnect = exports.mapActionsToProps = exports.getFlagsFromState = exports.initLD = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _redux = require('redux');

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

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _decorator = require('./decorator');

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userAgentParser = new _uaParserJs2.default();
var isMobileDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'mobile';
var isTabletDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'tablet';

var initLD = exports.initLD = function initLD(clientSideId, reduxStore, user) {
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
    console.log('ldclient ready. user: ' + (0, _stringify2.default)(user));
    reduxStore.dispatch((0, _actions.setLDReady)());
  });
};

var getFlagsFromState = exports.getFlagsFromState = function getFlagsFromState(state, flags) {
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

var mapActionsToProps = exports.mapActionsToProps = function mapActionsToProps() {
  for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
    actions[_key] = arguments[_key];
  }

  return function (dispatch) {
    return (0, _redux.bindActionCreators)(_assign2.default.apply(Object, [{}].concat(actions, [{ initialiseFlags: _actions.initialiseFlags }])), dispatch);
  };
};

var ldConnect = exports.ldConnect = _decorator2.default;
var ldReducer = exports.ldReducer = _reducer2.default;