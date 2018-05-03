const {expect} = require('chai');
const {JSDOM} = require('jsdom');

const reactVersions = {
	15: {
		reactUrl: 'https://cdn.jsdelivr.net/npm/react@15.6.2/dist/react.min.js',
		reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@15.6.2/dist/react-dom.min.js'
	},
	16: {
		reactUrl: 'https://cdn.jsdelivr.net/npm/react@16.3.2/umd/react.production.min.js',
		reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@16.3.2/umd/react-dom.production.min.js'
	}
};

for (const [version, {reactUrl, reactDomUrl}] of Object.entries(reactVersions)) {
	describe(`Tests with React v${version}`, () => {
		let DOM;

		before('init DOM and load React', function (done) {
			DOM = new JSDOM(`<!DOCTYPE html>
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
			const document = DOM.window.document;
			if (document.readyState === 'complete') {
				done();
			} else {
				document.addEventListener('load', () => done());
			}
		});

		it('has loaded React', () => {
			expect(DOM.window.React).not.to.be.equal(undefined);
			expect(DOM.window.ReactDOM).not.to.be.equal(undefined);
		});
	});
}
