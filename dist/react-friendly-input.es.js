/**
 * React Friendly Input v0.1.2 (https://github.com/Finesse/react-friendly-input)
 * Copyright 2018 Surgie Finesse
 * Licensed under the MIT license
 */
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
  var _class, _temp2, _initialiseProps;

  var name = (isFunction(Input) ? Input.displayName || Input.name : null) || Input;

  return _temp2 = _class = function (_Component) {
    _inherits(_class, _Component);

    function _class() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
    }
    /**
     * {@inheritDoc}
     */


    /**
     * The underlying controlled input
     * @public
     * @readonly
     * @type {HTMLElement|React.Element|null}
     */


    /**
     * Is the input focused
     * @protected
     * @type {boolean}
     */


    _createClass(_class, [{
      key: 'forceValue',


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


      /**
       * Handles a native input `focus` event
       *
       * @protected
       * @param {*[]} args
       */


      /**
       * Handles a native input `blur` event
       *
       * @protected
       * @param {*[]} args
       */

    }, {
      key: 'render',


      /**
       * {@inheritDoc}
       */
      value: function render() {
        var _props = this.props,
            value = _props.value,
            defaultValue = _props.defaultValue,
            inputRef = _props.inputRef,
            props = _objectWithoutProperties(_props, ['value', 'defaultValue', 'inputRef']);

        if (value !== undefined) {
          defaultValue = value;
        }

        return createElement(Input, _extends({}, props, {
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
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        // No value change from a parent when a user interacts with the input!
        if (this.isFocused) {
          return;
        }

        if (prevProps.value !== this.props.value && this.props.value !== undefined) {
          this.forceValue(this.props.value);
        }

        // React doesn't call the ref function when the `inputRef` prop is changed so we have to handle it manually
        if (prevProps.inputRef !== this.props.inputRef) {
          sendElementToRef(prevProps.inputRef, null);
          sendElementToRef(this.props.inputRef, this.input);
        }
      }
    }, {
      key: 'value',


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
  }(Component), _class.displayName = 'palInput(' + name + ')', _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.input = null;
    this.isFocused = false;

    this.receiveInput = function (input) {
      _this2.input = input;
      sendElementToRef(_this2.props.inputRef, input);
    };

    this.handleFocus = function () {
      _this2.isFocused = true;

      if (isFunction(_this2.props.onFocus)) {
        var _props2;

        (_props2 = _this2.props).onFocus.apply(_props2, arguments);
      }
    };

    this.handleBlur = function () {
      _this2.isFocused = false;

      if (isFunction(_this2.props.onBlur)) {
        var _props3;

        (_props3 = _this2.props).onBlur.apply(_props3, arguments);
      }

      // If the input is controlled (has the value property), resets the native input value to the props value
      if (_this2.props.value !== undefined) {
        _this2.forceValue(_this2.props.value);
      }
    };
  }, _temp2;
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
  } else if (ref && (typeof ref === 'undefined' ? 'undefined' : _typeof(ref)) === 'object' && ref.hasOwnProperty('current')) {
    ref.current = element;
  }
}