const {readFileSync} = require('fs');
const {expect} = require('chai');
const {JSDOM} = require('jsdom');

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
			let window, view;

			before('init a DOM and load React', async function () {
				this.timeout(10000);

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
					runScripts: 'dangerously'
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
				const FriendlyInput = window.reactFriendlyInput('input');
				window.ReactDOM.render(window.React.createElement(FriendlyInput, {type: 'text', value: 'initial'}), view);

				const input = view.firstElementChild;
				expect(input).not.to.equal('undefined');
				expect(input.tagName).to.equal('INPUT');
				expect(input.type).to.equal('text');
				expect(input.value).to.equal('initial');
			});

			it('lets change the input value through props when the input is not focused', () => {
				const FriendlyInput = window.reactFriendlyInput('input');
				window.ReactDOM.render(window.React.createElement(FriendlyInput, {type: 'text', value: 'before focus'}), view);
				expect(view.firstElementChild.value).to.equal('before focus');
			});

			it('doesn\'t let change the input value and selection through props when the input is focused', () => {
				const FriendlyInput = window.reactFriendlyInput('input');

				// This is the only way to focus the input I've found (it is not a fault of jsdom)
				window.ReactDOM.render(window.React.createElement(FriendlyInput, {type: 'text', value: 'before focus'}), view);
				let input = view.firstElementChild;
				input.focus();
				input.value += ' typing';
				input.selectionStart = input.selectionEnd = 5;

				window.ReactDOM.render(window.React.createElement(FriendlyInput, {type: 'text', value: 'while focus'}), view);
				input = view.firstElementChild;
				expect(input.value).to.equal('before focus typing');
				expect(input.selectionStart).to.equal(5);
				expect(input.selectionEnd).to.equal(5);
			});

			it('applies the value, passed through props while the input was focused, on blur', () => {
				const input = view.firstElementChild;
				input.value += ' more';
				input.blur();
				expect(input.value).to.equal('while focus');
			});

			it('unmounts the input', () => {
				window.ReactDOM.unmountComponentAtNode(view);
				expect(view.childNodes.length).to.be.equal(0);
			});

			after('destroy the DOM', () => {
				window.close();
			});
		});
	}
});
