const expect = chai.expect;

// This test expects to be run in a browser. That's why it is written on ES5. Open runner.html to run it.
describe('Tests reactFriendlyInput', function () {

	const reactVersions = [
		{
			version: '0.14',
			reactUrl: 'https://cdn.jsdelivr.net/npm/react@0.14/dist/react.min.js',
			reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@0.14/dist/react-dom.min.js'
		},
		{
			version: '15',
			reactUrl: 'https://cdn.jsdelivr.net/npm/react@15/dist/react.min.js',
			reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@15/dist/react-dom.min.js'
		},
		{
			version: '16',
			reactUrl: 'https://cdn.jsdelivr.net/npm/react@16/umd/react.production.min.js',
			reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@16/umd/react-dom.production.min.js'
		}
	];

	const app = document.getElementById('app');

	// Run the tests in the browser environment with each supported React version
	reactVersions.forEach(function (reactVersion) {
		const version = reactVersion.version;
		const reactUrl = reactVersion.reactUrl;
		const reactDomUrl = reactVersion.reactDomUrl;

		describe('Tests with React v' + version, function () {
			before('load the resources', function (done) {
				this.timeout(10000);
				loadScriptsSync([reactUrl, reactDomUrl, '../dist/react-friendly-input.umd.js'], done);
			});

			it('has loaded resources', function () {
				expect(window.React).not.to.equal(undefined);
				expect(window.ReactDOM).not.to.equal(undefined);
				expect(window.reactFriendlyInput).to.be.a('function');
			});

			it('has correct display name', function () {
				expect(reactFriendlyInput('input').displayName).to.equal('reactFriendlyInput(input)');
				expect(reactFriendlyInput('select').displayName).to.equal('reactFriendlyInput(select)');
				//expect(reactFriendlyInput(class Foo extends window.React.Component {}).displayName).to.equal('reactFriendlyInput(Foo)');
			});

			it('renders an input', function () {
				const FriendlyInput = reactFriendlyInput('input');
				ReactDOM.render(React.createElement(FriendlyInput, {type: 'text', value: 'initial'}), app);

				const input = app.firstElementChild;
				expect(input).not.to.equal('undefined');
				expect(input.tagName).to.equal('INPUT');
				expect(input.type).to.equal('text');
				expect(input.value).to.equal('initial');
			});

			it('lets change the input value when the input is not focused', function () {
				const FriendlyInput = reactFriendlyInput('input');
				ReactDOM.render(React.createElement(FriendlyInput, {type: 'text', value: 'before focus'}), app);
				expect(app.firstElementChild.value).to.equal('before focus');
			});

			it('doesn\'t let change the input value when the input is focused', function () {
				const FriendlyInput = reactFriendlyInput('input');

				// This is the only way to focus the input I've found
				ReactDOM.render(React.createElement(FriendlyInput, {type: 'text', value: 'before focus'}), app);
				app.firstElementChild.focus();

				ReactDOM.render(React.createElement(FriendlyInput, {type: 'text', value: 'while focus'}), app);
				expect(app.firstElementChild.value).to.equal('before focus');
			});

			it('applies the value, passed by props while the input was focused, on blur', function () {
				const input = app.firstElementChild;
				input.blur();
				expect(input.value).to.equal('while focus');
			});

			it('unmounts the input', function () {
				ReactDOM.unmountComponentAtNode(app);
				expect(app.childNodes.length).to.be.equal(0);
			});

			after('unload the resources', function () {
				delete window.React;
				delete window.ReactDOM;
				delete window.reactFriendlyInput;
			});
		});
	});
});


function loadScript(url, callback, document)
{
	if (!callback) {
		callback = function () {};
	}
	if (!document) {
		document = window.document;
	}

	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
	script.onload = function () {callback(null, script)};
	script.onerror = callback;
	script.src = url;
	(document.head || document.body).appendChild(script);
}

function loadScriptsSync(urls, callback)
{
	if (!callback) {
		callback = function () {};
	}

	if (!urls.length) {
		callback();
		return;
	}

	urls = urls.concat([]);
	const url = urls.shift();

	loadScript(url, function (error) {
		if (error) {
			callback(error);
		} else {
			loadScriptsSync(urls, callback);
		}
	});
}
