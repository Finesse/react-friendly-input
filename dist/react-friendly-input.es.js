/**
 * React Friendly Input v0.0.0 (https://github.com/FinesseRus/react-friendly-input)
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
 *     textarea, select) or another component which behaves the same way (has the value property and focus/blur events).
 * @return {Function} The friendly React component
 */
export function palInput(Input) {
	var _class, _temp;

	var name = (isFunction(Input) ? Input.displayName || Input.name : null) || Input;

	return _temp = _class = function (_Component) {
		_inherits(_class, _Component);

		/**
   * {@inheritDoc}
   */


		/**
   * The underlying controlled input
   * @protected
   * @type {HTMLElement|null}
   */
		function _class(props) {
			_classCallCheck(this, _class);

			var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

			_this.input = null;
			_this.isFocused = false;


			_this.receiveInput = _this.receiveInput.bind(_this);
			_this.handleFocus = _this.handleFocus.bind(_this);
			_this.handleBlur = _this.handleBlur.bind(_this);
			return _this;
		}

		/**
   * Handles an underlying input reference from React.
   *
   * @protected
   * @param {HTMLElement|null} input
   */


		/**
   * Is the input focused
   * @protected
   * @type {boolean}
   */

		/**
   * {@inheritDoc}
   */


		_createClass(_class, [{
			key: 'receiveInput',
			value: function receiveInput(input) {
				this.input = input;
				sendElementToRef(this.props.inputRef, input);
			}

			/**
    * Handles a native input `focus` event.
    *
    * @protected
    * @param {*[]} args
    */

		}, {
			key: 'handleFocus',
			value: function handleFocus() {
				this.isFocused = true;

				if (isFunction(this.props.onFocus)) {
					var _props;

					(_props = this.props).onFocus.apply(_props, arguments);
				}
			}

			/**
    * Handles a native input `blur` event.
    *
    * @protected
    * @param {*[]} args
    */

		}, {
			key: 'handleBlur',
			value: function handleBlur() {
				this.isFocused = false;

				if (isFunction(this.props.onBlur)) {
					var _props2;

					(_props2 = this.props).onBlur.apply(_props2, arguments);
				}

				// If the input is controlled (has the value property), resets the native input value to the props value
				if (this.props.value !== undefined) {
					this.input.value = this.props.value;
				}
			}

			/**
    * {@inheritDoc}
    */

		}, {
			key: 'render',
			value: function render() {
				var _props3 = this.props,
				    value = _props3.value,
				    defaultValue = _props3.defaultValue,
				    inputRef = _props3.inputRef,
				    props = _objectWithoutProperties(_props3, ['value', 'defaultValue', 'inputRef']);

				return createElement(Input, _extends({}, props, {
					ref: this.receiveInput,
					onFocus: this.handleFocus,
					onBlur: this.handleBlur
				}));
			}

			/**
    * {@inheritDoc}
    */

		}, {
			key: 'componentDidMount',
			value: function componentDidMount() {
				if (this.isFocused) {
					return;
				}

				var value = '';
				if (this.props.value !== undefined) {
					value = this.props.value;
				} else if (this.props.defaultValue !== undefined) {
					value = this.props.defaultValue;
				}
				this.input.value = value;
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
					this.input.value = this.props.value;
				}

				// React doesn't call the ref function when the `inputRef` prop is changed so we have to handle it manually
				if (prevProps.inputRef !== this.props.inputRef) {
					sendElementToRef(prevProps.inputRef, null);
					sendElementToRef(this.props.inputRef, this.input);
				}
			}
		}]);

		return _class;
	}(Component), _class.displayName = 'palInput(' + name + ')', _temp;
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