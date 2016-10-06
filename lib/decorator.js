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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (flags) {
  return function (WrappedComponent) {
    var WithFeatureFlags = function (_Component) {
      (0, _inherits3.default)(WithFeatureFlags, _Component);

      function WithFeatureFlags() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, WithFeatureFlags);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = WithFeatureFlags.__proto__ || (0, _getPrototypeOf2.default)(WithFeatureFlags)).call.apply(_ref, [this].concat(args))), _this), _this.initialise = function () {
          _this.props.initialiseFlags(flags);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
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
        key: 'render',
        value: function render() {
          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(WrappedComponent, this.props)
          );
        }
      }]);
      return WithFeatureFlags;
    }(_react.Component);

    WithFeatureFlags.propTypes = {
      isLDReady: _react.PropTypes.bool
    };


    return WithFeatureFlags;
  };
};