const {writeFile} = require('fs');
const {promisify} = require('util');
const babel = require('babel-core');
const uglifyES = require('uglify-es');
const {version, author, homepage} = require('./package.json');

(async () => {
	const startYear = 2018;
	const currentYear = new Date().getFullYear();
	const copyrightNotice = `/**
 * React Friendly Input v${version} (${homepage})
 * Copyright ${(startYear === currentYear ? `` : `${startYear}-`) + currentYear} ${author.name}
 * Licensed under the MIT license
 */
`;

	// Building the full code with ES5 syntax and ES6 import/export
	let {code} = await promisify(babel.transformFile)('./src/reactFriendlyInput.js', {
		presets: [
			['env', {
				targets: {
					browsers: ['> 0.1%', 'IE >= 9', 'not IE < 9'] // According to https://reactjs.org/docs/react-dom.html#browser-support
				},
				modules: false
			}]
		],
		plugins: ['transform-object-rest-spread', 'transform-class-properties']
	});
	await promisify(writeFile)('./dist/react-friendly-input.es.js', copyrightNotice + code);
	console.log('`dist/react-friendly-input.es.js` has been built');

	// Building the full UMD code (for browser)
	code = babel.transform(code, {
		plugins: [
			['transform-es2015-modules-umd', {
				'globals': {
					'react': 'React'
				}
			}]
		]
	}).code.replace(/(\sglobal\.)unknown(\s*=\s*mod\.exports;)/, `$1reactFriendlyInput$2`); // Babel UMD transform doesn't have settings for it so I have to do it manually
	await promisify(writeFile)('./dist/react-friendly-input.umd.js', copyrightNotice + code);
	console.log('`dist/react-friendly-input.umd.js` has been built');

	// Building the minified UMD code
	code = uglifyES.minify(code).code;
	await promisify(writeFile)('./dist/react-friendly-input.umd.min.js', copyrightNotice + code);
	console.log('`dist/react-friendly-input.umd.min.js` has been built');
})();
