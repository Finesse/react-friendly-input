/**
 * React Friendly Input v0.0.0 (https://github.com/FinesseRus/react-friendly-input)
 * Copyright 2018 Surgie Finesse
 * Licensed under the MIT license
 */
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
export default function reactFriendlyInput(Input) {
	var _class, _temp;

	var name = Input instanceof Object ? Input.displayName || Input.name : Input;

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


			_this.inputRef = _this.inputRef.bind(_this);
			_this.handleFocus = _this.handleFocus.bind(_this);
			_this.handleBlur = _this.handleBlur.bind(_this);
			return _this;
		}

		/**
   * Handles an underlying input reference from React/
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
			key: 'inputRef',
			value: function inputRef(input) {
				this.input = input;

				if (this.props.inputRef instanceof Function) {
					this.props.inputRef(input);
				}
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

				if (this.props.onFocus instanceof Function) {
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

				if (this.props.onBlur instanceof Function) {
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
					ref: this.inputRef,
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
			}
		}]);

		return _class;
	}(Component), _class.displayName = 'reactFriendlyInput(' + name + ')', _temp;
}

/**
 * Friendly <input> React component
 * @see reactFriendlyInput What is "friendly"
 * @type {Function}
 */
export var Input = reactFriendlyInput('input');

/**
 * Friendly <textarea> React component
 * @see reactFriendlyInput What is "friendly"
 * @type {Function}
 */
export var TextArea = reactFriendlyInput('textarea');

/**
 * Friendly <select> React component
 * @see reactFriendlyInput What is "friendly"
 * @type {Function}
 */
export var Select = reactFriendlyInput('select');