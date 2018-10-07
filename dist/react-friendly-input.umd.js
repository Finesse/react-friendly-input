/**
 * React Friendly Input v0.1.3 (https://github.com/Finesse/react-friendly-input)
 * Copyright 2018 Surgie Finesse
 * Licensed under the MIT license
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.React);
    global.reactFriendlyInput = mod.exports;
  }
})(this, function (_exports, _react) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.palInput = palInput;
  _exports.Select = _exports.TextArea = _exports.Input = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Turns an input React component into a friendly input React component. A friendly input value can't be changed from
   * a parent when a user interacts with the input.
   *
   * All the given props are passed to the given input React component. If you need to get a reference to the React
   * element of the given component, use the `inputRef` prop like you would use the `ref` prop.
   *
   * @param {Function|string} Input The input React component. It is not modified. It can be either a HTML element (input,
   *   textarea, select) or another component which behaves the same way (has the value property and focus/blur events).
   * @return {Function} The friendly React component
   */
  function palInput(Input) {
    var _class, _temp;

    var name = (isFunction(Input) ? Input.displayName || Input.name : null) || Input;
    return _temp = _class =
    /*#__PURE__*/
    function (_Component) {
      _inherits(_class, _Component);

      function _class() {
        var _getPrototypeOf2;

        var _this;

        _classCallCheck(this, _class);

        for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
          _args[_key] = arguments[_key];
        }

        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class)).call.apply(_getPrototypeOf2, [this].concat(_args)));

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "input", null);

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isFocused", false);

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "receiveInput", function (input) {
          _this.input = input;
          sendElementToRef(_this.props.inputRef, input);
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleFocus", function () {
          _this.isFocused = true;

          if (isFunction(_this.props.onFocus)) {
            var _this$props;

            (_this$props = _this.props).onFocus.apply(_this$props, arguments);
          }
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleBlur", function () {
          _this.isFocused = false;

          if (isFunction(_this.props.onBlur)) {
            var _this$props2;

            (_this$props2 = _this.props).onBlur.apply(_this$props2, arguments);
          } // If the input is controlled (has the value property), resets the native input value to the props value


          if (_this.props.value !== undefined) {
            _this.forceValue(_this.props.value);
          }
        });

        return _this;
      }

      _createClass(_class, [{
        key: "forceValue",

        /**
         * Sets a new value despite whether the input is focused or not
         *
         * @param {*} value A new value
         */
        value: function forceValue(value) {
          if (this.input) {
            this.input.value = value;
          }
        }
        /**
         * Handles an underlying input reference from React.
         *
         * @protected
         * @param {HTMLElement|null} input
         */

      }, {
        key: "render",

        /**
         * {@inheritDoc}
         */
        value: function render() {
          var _this$props3 = this.props,
              value = _this$props3.value,
              defaultValue = _this$props3.defaultValue,
              inputRef = _this$props3.inputRef,
              props = _objectWithoutProperties(_this$props3, ["value", "defaultValue", "inputRef"]);

          if (value !== undefined) {
            defaultValue = value;
          }

          return (0, _react.createElement)(Input, _objectSpread({}, props, {
            defaultValue: defaultValue,
            ref: this.receiveInput,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur
          }));
        }
        /**
         * {@inheritDoc}
         */

      }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
          // No value change from a parent when a user interacts with the input!
          if (this.isFocused) {
            return;
          }

          if (prevProps.value !== this.props.value && this.props.value !== undefined) {
            this.forceValue(this.props.value);
          } // React doesn't call the ref function when the `inputRef` prop is changed so we have to handle it manually


          if (prevProps.inputRef !== this.props.inputRef) {
            sendElementToRef(prevProps.inputRef, null);
            sendElementToRef(this.props.inputRef, this.input);
          }
        }
      }, {
        key: "value",

        /**
         * Getter for the `value` property
         *
         * @return {*|undefined}
         */
        get: function get() {
          return this.input ? this.input.value : undefined;
        }
        /**
         * Setter for the `value` property
         *
         * @param {*} value A new value
         */
        ,
        set: function set(value) {
          if (!this.isFocused) {
            this.forceValue(value);
          }
        }
      }]);

      return _class;
    }(_react.Component), _defineProperty(_class, "displayName", "palInput(".concat(name, ")")), _temp;
  }
  /**
   * Friendly <input> React component
   * @see palInput What is "friendly"
   * @type {Function}
   */


  var Input = palInput('input');
  /**
   * Friendly <textarea> React component
   * @see palInput What is "friendly"
   * @type {Function}
   */

  _exports.Input = Input;
  var TextArea = palInput('textarea');
  /**
   * Friendly <select> React component
   * @see palInput What is "friendly"
   * @type {Function}
   */

  _exports.TextArea = TextArea;
  var Select = palInput('select');
  /**
   * Checks whether the value is a function
   *
   * @param {*} value
   * @return {boolean}
   */

  _exports.Select = Select;

  function isFunction(value) {
    return typeof value === 'function';
  }
  /**
   * Sends an element to a ref prop value.
   *
   * @param {*} ref The ref value. It can be empty (no ref).
   * @param {HTMLElement|React.Element|null} element The element to send
   * @see https://reactjs.org/docs/refs-and-the-dom.html Ref documentation
   */


  function sendElementToRef(ref, element) {
    if (isFunction(ref)) {
      ref(element);
    } else if (ref && _typeof(ref) === 'object' && ref.hasOwnProperty('current')) {
      ref.current = element;
    }
  }
});