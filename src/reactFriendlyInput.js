import {Component, createElement, forwardRef} from 'react';

/**
 * Turns an input React component into a friendly input React component. A friendly input value can't be changed from
 * a parent when a user interacts with the input.
 *
 * @param {Function|string} Input The input React component. It is not modified. It can be either a HTML element (input,
 *     textarea, select) or another component which behaves the same way (has the value property and focus/blur events).
 * @return {Function} The friendly React component
 */
export default function reactFriendlyInput(Input)
{
	class FriendlyInput extends Component
	{
		/**
		 * The underlying controlled input
		 * @protected
		 * @type {HTMLElement|null}
		 */
		input = null;

		/**
		 * Is the input focused
		 * @protected
		 * @type {boolean}
		 */
		isFocused = false;

		/**
		 * {@inheritDoc}
		 */
		constructor(props)
		{
			super(props);

			this.inputRef = this.inputRef.bind(this);
			this.handleFocus = this.handleFocus.bind(this);
			this.handleBlur = this.handleBlur.bind(this);
		}

		/**
		 * Handles an underlying input reference from React/
		 *
		 * @protected
		 * @param {HTMLElement|null} input
		 */
		inputRef(input)
		{
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
		handleFocus(...args)
		{
			this.isFocused = true;

			if (this.props.onFocus instanceof Function) {
				this.props.onFocus(...args);
			}
		}

		/**
		 * Handles a native input `blur` event.
		 *
		 * @protected
		 * @param {*[]} args
		 */
		handleBlur(...args)
		{
			this.isFocused = false;

			if (this.props.onBlur instanceof Function) {
				this.props.onBlur(...args);
			}

			// If the input is controlled (has the value property), resets the native input value to the props value
			if (this.props.value !== undefined) {
				this.input.value = this.props.value;
			}
		}

		/**
		 * {@inheritDoc}
		 */
		render()
		{
			return createElement(Input, {
				...this.props,
				value: undefined,
				defaultValue: undefined,
				ref: this.inputRef,
				onFocus: this.handleFocus,
				onBlur: this.handleBlur
			});
		}

		/**
		 * {@inheritDoc}
		 */
		componentDidMount()
		{
			if (this.isFocused) {
				return;
			}

			let value = '';
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
		componentDidUpdate(prevProps)
		{
			// No value change from a parent when a user interacts with the input!
			if (this.isFocused) {
				return;
			}

			if (prevProps.value !== this.props.value && this.props.value !== undefined) {
				this.input.value = this.props.value;
			}
		}
	}

	function refForwarder(props, ref)
	{
		return createElement(FriendlyInput, {
			...props,
			forwardedRef: ref
		});
	}

	// Give this component a more helpful display name in DevTools, e.g. "ForwardRef(friendlyInput(Input))"
	const name = Input instanceof Object ? Input.displayName || Input.name : Input;
	refForwarder.displayName = `reactFriendlyInput(${name})`;

	return forwardRef(refForwarder);
}

/**
 * Friendly <input> React component
 * @see friendlyInput What is "friendly"
 * @type {Function}
 */
export const Input = friendlyInput('input');

/**
 * Friendly <textarea> React component
 * @see friendlyInput What is "friendly"
 * @type {Function}
 */
export const TextArea = friendlyInput('textarea');

/**
 * Friendly <select> React component
 * @see friendlyInput What is "friendly"
 * @type {Function}
 */
export const Select = friendlyInput('select');
