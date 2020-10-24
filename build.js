const {writeFile} = require('fs');
const {promisify} = require('util');
const babel = require('@babel/core');
const terser = require('terser');
const {version, author, homepage, dependencies} = require('./package.json');

const writeFileAsync = promisify(writeFile);

const startYear = 2018;
const currentYear = new Date().getFullYear();
const copyrightNotice = `/**
 * React Friendly Input v${version} (${homepage})
 * Copyright ${(startYear === currentYear ? `` : `${startYear}-`) + currentYear} ${author.name}
 * Licensed under the MIT license
 */
`;

const babelEnvPresetConfig = {
  targets: {
    browsers: ['> 0.1%', 'IE >= 9', 'not IE < 9'] // According to https://reactjs.org/docs/react-dom.html#browser-support
  }
};
const babelPlugins = [
  '@babel/plugin-proposal-class-properties'
];

async function buildForNode() {
  // Building the full module code
  let {code} = await babel.transformFileAsync('./src/reactFriendlyInput.js', {
    presets: [
      ['@babel/preset-env', {
        ...babelEnvPresetConfig,
        modules: false
      }]
    ],
    plugins: [
      ...babelPlugins,
      ['@babel/plugin-transform-runtime', {
        version: dependencies["@babel/runtime"]
      }]
    ]
  });
  await writeFileAsync('./dist/react-friendly-input.es.js', copyrightNotice + code);
  console.log('`dist/react-friendly-input.es.js` has been built');

  // Building the full CommonJS code
  code = babel.transform(code, {
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-transform-runtime'
    ]
  }).code;
  await writeFileAsync('./dist/react-friendly-input.cjs.js', copyrightNotice + code);
  console.log('`dist/react-friendly-input.cjs.js` has been built');
}

async function buildForBrowser() {
  // Building the full UMD code
  let {code} = await babel.transformFileAsync('./src/reactFriendlyInput.js', {
    presets: [
      ['@babel/preset-env', babelEnvPresetConfig]
    ],
    plugins: [
      ...babelPlugins,
      ['@babel/plugin-transform-modules-umd', {
        globals: {
          react: 'React'
        }
      }]
    ]
  });
  await writeFileAsync('./dist/react-friendly-input.umd.js', copyrightNotice + code);
  console.log('`dist/react-friendly-input.umd.js` has been built');

  // Building the minified UMD code
  code = (await terser.minify(code)).code;
  await writeFileAsync('./dist/react-friendly-input.umd.min.js', copyrightNotice + code);
  console.log('`dist/react-friendly-input.umd.min.js` has been built');
}

buildForNode();
buildForBrowser();
