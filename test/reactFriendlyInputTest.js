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
		describe(`Tests with React v${version}`, () => {
			let window;

			before('init DOM and load React', function (done) {
				this.timeout(10000);

				const DOM = new JSDOM(`<!DOCTYPE html>
				<html>
					<head>
						<script src="${reactUrl}"></script>
						<script src="${reactDomUrl}"></script>
					</head>
					<body></body>
				</html>`, {
					resources: 'usable',
					runScripts: 'dangerously'
				});
				window = DOM.window;
				if (window.document.readyState === 'complete') {
					done();
				} else {
					window.document.addEventListener('load', () => done());
				}
			});

			it('has loaded React', () => {
				expect(window.React).not.to.equal(undefined);
				expect(window.ReactDOM).not.to.equal(undefined);
			});

			it('defines the library', () => {
				window.document.write(`<script>${reactFriendlyInputCode}</script>`);
				expect(window.reactFriendlyInput).to.be.a('function');
			});

			it('creates an input', () => {
				const FriendlyInput = window.reactFriendlyInput('input');
				window.ReactDOM.render(window.React.createElement(FriendlyInput, {type: 'text'}), window.document.body);

				const input = window.document.body.firstElementChild;
				expect(input).not.to.equal('undefined');
				expect(input.tagName).to.equal('INPUT');
				expect(input.type).to.equal('text');
			});
		});
	}
});
