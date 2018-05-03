const {readFileSync} = require('fs');
const {expect} = require('chai');
const {JSDOM, VirtualConsole} = require('jsdom');

describe('Tests reactFriendlyInput', () => {

	const reactVersions = {
		0.14: {
			reactUrl: 'https://cdn.jsdelivr.net/npm/react@0.14/dist/react.min.js',
			reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@0.14/dist/react-dom.min.js'
		},
		15: {
			reactUrl: 'https://cdn.jsdelivr.net/npm/react@15/dist/react.min.js',
			reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@15/dist/react-dom.min.js'
		},
		16: {
			reactUrl: 'https://cdn.jsdelivr.net/npm/react@16/umd/react.production.min.js',
			reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@16/umd/react-dom.production.min.js'
		}
	};

	const reactFriendlyInputCode = readFileSync(__dirname + '/../dist/react-friendly-input.umd.js');

	// Run each test in the browser environment with every supported React version
	for (const [version, {reactUrl, reactDomUrl}] of Object.entries(reactVersions)) {
		describe(`React v${version}`, () => {
			let window, view, virtualConsole;

			before('init a DOM and load React', async function () {
				this.timeout(10000);

				// You can use it to debug: https://github.com/jsdom/jsdom#virtual-consoles
				virtualConsole = new VirtualConsole();
				virtualConsole.on('log', (...args) => console.log(...args));
				virtualConsole.on('error', (...args) => console.error(...args));
				virtualConsole.on('warn', (...args) => console.warn(...args));
				virtualConsole.on('info', (...args) => console.info(...args));

				const DOM = new JSDOM(`<!DOCTYPE html>
				<html>
					<head>
						<script src="${reactUrl}"></script>
						<script src="${reactDomUrl}"></script>
						<script>${reactFriendlyInputCode}</script>
					</head>
					<body>
						<div id="app"></div>
					</body>
				</html>`, {
					resources: 'usable',
					runScripts: 'dangerously',
					virtualConsole
				});
				window = DOM.window;

				await new Promise(resolve => {
					if (window.document.readyState === 'complete') {
						resolve();
					} else {
						window.document.addEventListener('load', resolve);
					}
				});
				view = window.document.getElementById('app');
			});

			it('has loaded resources', () => {
				expect(window.React).not.to.equal(undefined);
				expect(window.ReactDOM).not.to.equal(undefined);
				expect(window.reactFriendlyInput).to.be.a('function');
			});

			it('has correct display name', () => {
				expect(window.reactFriendlyInput('input').displayName).to.equal('reactFriendlyInput(input)');
				expect(window.reactFriendlyInput('select').displayName).to.equal('reactFriendlyInput(select)');
				expect(window.reactFriendlyInput(class Foo extends window.React.Component {}).displayName).to.equal('reactFriendlyInput(Foo)');
			});

			it('renders an input', () => {
				window.ReactDOM.render(
					window.React.createElement(window.reactFriendlyInput('input'), {
						type: 'number',
						value: '1234',
						min: '-1',
						max: '3'
					}),
					view
				);

				expect(view.childNodes).to.have.lengthOf(1);
				const input = view.firstElementChild;
				expect(input).not.to.equal('undefined');
				expect(input.tagName).to.equal('INPUT');
				expect(input.type).to.equal('number');
				expect(input.value).to.equal('1234');
				expect(input.min).to.equal('-1');
				expect(input.max).to.equal('3');
			});

			it('unmounts the input', () => {
				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text'}), view);
				window.ReactDOM.unmountComponentAtNode(view);
				expect(view.childNodes).to.have.lengthOf(0);
			});

			it('lets change the input value through props when the input is not focused', () => {
				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'before'}), view);
				const input = view.firstElementChild;
				expect(input.value).to.equal('before');

				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'after'}), view);
				expect(view.firstElementChild).to.equal(input);
				expect(input.value).to.equal('after');
			});

			it('doesn\'t let change the input value and selection through props when the input is focused', () => {
				// This is the only way to focus the input I've found (it is not a fault of jsdom)
				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'before focus'}), view);
				const input = view.firstElementChild;
				input.focus();
				expect(input).to.equal(window.document.activeElement); // Checks that the input is focused

				input.value += ' typing';
				input.selectionStart = input.selectionEnd = 5;
				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'while focus'}), view);

				expect(view.firstElementChild).to.equal(input);
				expect(input.value).to.equal('before focus typing');
				expect(input.selectionStart).to.equal(5);
				expect(input.selectionEnd).to.equal(5);
			});

			it('applies the value, passed through props while the input was focused, on blur', () => {
				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'before focus'}), view);
				const input = view.firstElementChild;
				input.focus();
				expect(input).to.equal(window.document.activeElement);

				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'while focus'}), view);
				expect(view.firstElementChild).to.equal(input);
				expect(input.value).to.equal('before focus');

				input.blur();
				expect(input).not.to.equal(window.document.activeElement);
				expect(input.value).to.equal('while focus');
			});

			it('doesn\'t change the input value in uncontrolled mode', () => {
				window.ReactDOM.unmountComponentAtNode(view);

				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', defaultValue: 'abc'}), view);
				const input = view.firstElementChild;
				expect(input.value).to.equal('abc');

				input.value += 'de';
				expect(input.value).to.equal('abcde');

				input.focus();
				expect(input).to.equal(window.document.activeElement);
				input.value += 'f';
				expect(input.value).to.equal('abcdef');

				input.blur();
				expect(input).not.to.equal(window.document.activeElement);
				expect(input.value).to.equal('abcdef');
			});

			it('provides a ref to the wrapped component (callback)', () => {
				let refInput;
				window.ReactDOM.render(
					window.React.createElement(window.reactFriendlyInput.Input, {
						type: 'checkbox',
						inputRef: input => refInput = input
					}),
					view
				);
				const domInput = view.firstElementChild;
				expect(refInput).to.be.ok;
				expect(refInput).to.equal(domInput);

				// One more time (changing the ref)
				let refInput2;
				window.ReactDOM.render(
					window.React.createElement(window.reactFriendlyInput.Input, {
						type: 'checkbox',
						inputRef: input => refInput2 = input
					}),
					view
				);
				expect(refInput2).to.be.ok;
				expect(refInput2).to.equal(domInput);
			});

			it('provides a ref to the wrapped component (React.createRef)', function () {
				// createRef appeared in React 16.3 https://reactjs.org/blog/2018/03/29/react-v-16-3.html#createref-api
				if (window.React.version.split('.').slice(0, 2).join('.') < 16.3) {
					this.skip();
					return;
				}

				const ref = window.React.createRef();
				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'checkbox', inputRef: ref}), view);
				const domInput = view.firstElementChild;
				expect(ref.current).to.be.ok;
				expect(ref.current).to.equal(domInput);
			});

			it('provides built-in components', () => {
				expect(window.reactFriendlyInput.Input).to.be.a('function');
				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input), view);
				expect(view.firstElementChild.tagName).to.equal('INPUT');

				expect(window.reactFriendlyInput.TextArea).to.be.a('function');
				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.TextArea), view);
				expect(view.firstElementChild.tagName).to.equal('TEXTAREA');

				expect(window.reactFriendlyInput.Select).to.be.a('function');
				window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Select), view);
				expect(view.firstElementChild.tagName).to.equal('SELECT');
			});

			it('works with custom components', () => {
				class MyComponent extends window.React.Component {
					get value() {
						return this.input.value;
					}
					set value(value) {
						this.input.value = value;
					}
					render() {
						return window.React.createElement('div', {}, window.React.createElement('input', {
							type: 'email',
							onFocus: this.props.onFocus,
							onInput: this.props.onInput,
							ref: element => this.input = element
						}));
					}
				}
				const MyFriendlyComponent = window.reactFriendlyInput(MyComponent);

				let element;
				window.ReactDOM.render(window.React.createElement(MyFriendlyComponent, {
					inputRef: input => element = input
				}), view);

				expect(view.firstElementChild.tagName).to.equal('DIV');
				expect(view.firstElementChild.firstElementChild.tagName).to.equal('INPUT');
				expect(view.firstElementChild.firstElementChild.type).to.equal('email');
				expect(element).to.be.instanceOf(MyComponent);
			});

			it('proxies events', () => {
				let clickCount = 0, focusCount = 0, inputCount = 0, blurCount = 0;
				window.ReactDOM.render(
					window.React.createElement(window.reactFriendlyInput.Input, {
						onFocus: () => ++focusCount,
						onBlur: () => ++blurCount,
						onInput: () => ++inputCount,
						onClick: () => ++clickCount
					}),
					view
				);
				const input = view.firstElementChild;

				input.click();
				expect(clickCount).to.equal(1);
				expect(focusCount).to.equal(0);
				expect(inputCount).to.equal(0);
				expect(blurCount).to.equal(0);

				input.focus();
				expect(clickCount).to.equal(1);
				expect(focusCount).to.equal(1);
				expect(inputCount).to.equal(0);
				expect(blurCount).to.equal(0);

				input.dispatchEvent(new window.Event('input', {
					'bubbles': true,
					'cancelable': true
				}));
				expect(clickCount).to.equal(1);
				expect(focusCount).to.equal(1);
				expect(inputCount).to.equal(1);
				expect(blurCount).to.equal(0);

				input.blur();
				expect(clickCount).to.equal(1);
				expect(focusCount).to.equal(1);
				expect(inputCount).to.equal(1);
				expect(blurCount).to.equal(1);
			});

			afterEach('clean up', () => {
				window.ReactDOM.unmountComponentAtNode(view);
				view.innerHTML = null;
			});

			after('destroy the DOM', () => {
				window.close();
			});
		});
	}
});
