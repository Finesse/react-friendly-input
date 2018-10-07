/**
 * React Friendly Input v0.1.3 (https://github.com/Finesse/react-friendly-input)
 * Copyright 2018 Surgie Finesse
 * Licensed under the MIT license
 */
import _typeof from "@babel/runtime/helpers/typeof";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { Component, createElement } from 'react';
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

export function palInput(Input) {
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

        return createElement(Input, _objectSpread({}, props, {
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
  }(Component), _defineProperty(_class, "displayName", "palInput(".concat(name, ")")), _temp;
}
/**
 * Friendly <input> React component
 * @see palInput What is "friendly"
 * @type {Function}
 */

export var Input = palInput('input');
/**
 * Friendly <textarea> React component
 * @see palInput What is "friendly"
 * @type {Function}
 */

export var TextArea = palInput('textarea');
/**
 * Friendly <select> React component
 * @see palInput What is "friendly"
 * @type {Function}
 */

export var Select = palInput('select');
/**
 * Checks whether the value is a function
 *
 * @param {*} value
 * @return {boolean}
 */

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