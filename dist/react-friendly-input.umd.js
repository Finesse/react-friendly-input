/**
 * React Friendly Input v0.0.0 (https://github.com/FinesseRus/react-friendly-input)
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
		var exports = mod.exports.default;
		for (var item in mod.exports) if (item !== 'default' && mod.exports.hasOwnProperty(item)) {
			exports[item] = mod.exports[item];
		}
		global.reactFriendlyInput = exports;
	}
})(this, function (exports, _react) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Select = exports.TextArea = exports.Input = undefined;
	exports.default = reactFriendlyInput;
	var _extends = Object.assign || function (target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}return target;
	};

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
			}
		}return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
		};
	}();

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	/**
  * Turns an input React component into a friendly input React component. A friendly input value can't be changed from
  * a parent when a user interacts with the input.
  *
  * @param {Function|string} Input The input React component. It is not modified. It can be either a HTML element (input,
  *     textarea, select) or another component which behaves the same way (has the value property and focus/blur events).
  * @return {Function} The friendly React component
  */
	function reactFriendlyInput(Input) {
		var FriendlyInput = function (_Component) {
			_inherits(FriendlyInput, _Component);

			/**
    * {@inheritDoc}
    */

			/**
    * The underlying controlled input
    * @protected
    * @type {HTMLElement|null}
    */
			function FriendlyInput(props) {
				_classCallCheck(this, FriendlyInput);

				var _this = _possibleConstructorReturn(this, (FriendlyInput.__proto__ || Object.getPrototypeOf(FriendlyInput)).call(this, props));

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

			_createClass(FriendlyInput, [{
				key: 'inputRef',
				value: function inputRef(input) {
					this.input = input;

					if (this.forwardedRef instanceof Function) {
						this.forwardedRef(input);
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
					return (0, _react.createElement)(Input, _extends({}, this.props, {
						value: undefined,
						defaultValue: undefined,
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

			return FriendlyInput;
		}(_react.Component);

		function refForwarder(props, ref) {
			return (0, _react.createElement)(FriendlyInput, _extends({}, props, {
				forwardedRef: ref
			}));
		}

		// Give this component a more helpful display name in DevTools, e.g. "ForwardRef(friendlyInput(Input))"
		var name = Input instanceof Object ? Input.displayName || Input.name : Input;
		refForwarder.displayName = 'reactFriendlyInput(' + name + ')';

		return (0, _react.forwardRef)(refForwarder);
	}

	/**
  * Friendly <input> React component
  * @see friendlyInput What is "friendly"
  * @type {Function}
  */
	var Input = exports.Input = friendlyInput('input');

	/**
  * Friendly <textarea> React component
  * @see friendlyInput What is "friendly"
  * @type {Function}
  */
	var TextArea = exports.TextArea = friendlyInput('textarea');

	/**
  * Friendly <select> React component
  * @see friendlyInput What is "friendly"
  * @type {Function}
  */
	var Select = exports.Select = friendlyInput('select');
});