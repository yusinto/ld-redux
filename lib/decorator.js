'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (flags) {
  return function (WrappedComponent) {
    var WithFeatureFlags = function (_Component) {
      (0, _inherits3.default)(WithFeatureFlags, _Component);

      // Need the store through context to call dispatch
      // https://github.com/reactjs/redux/issues/362
      function WithFeatureFlags(props) {
        (0, _classCallCheck3.default)(this, WithFeatureFlags);

        var _this = (0, _possibleConstructorReturn3.default)(this, (WithFeatureFlags.__proto__ || (0, _getPrototypeOf2.default)(WithFeatureFlags)).call(this, props));

        _this.initialise = _this.initialise.bind(_this);
        return _this;
      }

      (0, _createClass3.default)(WithFeatureFlags, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          if (this.props.isLDReady) {
            this.initialise();
          }
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
          if (newProps.isLDReady && !this.props.isLDReady) {
            this.initialise();
          }
        }
      }, {
        key: 'initialise',
        value: function initialise() {
          var dispatch = this.context.store.dispatch;

          var flagValues = {};

          var _loop = function _loop(flag) {
            var camelCasedKey = (0, _camelCase2.default)(flag);
            flagValues[camelCasedKey] = ldClient.variation(flag, flags[flag]);

            ldClient.on('change:' + flag, function (current) {
              var newFlagValues = {};
              newFlagValues[camelCasedKey] = current;

              dispatch((0, _actions.setFlags)(newFlagValues));
            });
          };

          for (var flag in flags) {
            _loop(flag);
          }

          dispatch((0, _actions.setFlags)(flagValues));
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, this.props);
        }
      }]);
      return WithFeatureFlags;
    }(_react.Component);

    WithFeatureFlags.contextTypes = {
      store: _react.PropTypes.object.isRequired
    };
    WithFeatureFlags.propTypes = {
      isLDReady: _react.PropTypes.bool
    };


    return WithFeatureFlags;
  };
};