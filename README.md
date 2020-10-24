# React Friendly Input

[![npm](https://img.shields.io/npm/v/react-friendly-input.svg)](https://www.npmjs.com/package/react-friendly-input)
![Supported React versions](https://img.shields.io/badge/React-v0.14,_v15,_v16,_v17-brightgreen.svg)
[![Gzip size](https://badgen.net/bundlephobia/minzip/react-friendly-input?color=green)](https://bundlephobia.com/result?p=react-friendly-input)

This is a set of [React](https://reactjs.org) form field components which don't change their value programmatically 
when focused. It helps to build controlled inputs that don't annoy users.

Here is a simple example. It is a React application where a user can change his/her name. A name must not start or end 
with a space and must be not more than 10 characters long. The user is typing ` I am typing a text ` and pressing <kbd>Tab</kbd>.

<table>
<thead>
<tr><th>Plain input</th><th>Friendly input</th></tr>
</thead>
<tbody>
<tr>
<td align="center">
      
![Plain input demo](docs/plainInput.gif?raw=true)
        
</td>
<td align="center">
      
![Friendly input demo](docs/friendlyInput.gif?raw=true)
        
</td>
</tr>
<tr>
<td>

```jsx
class App extends React.Component {
  state = {
    name: ''
  };
  
  setName = event => {
    this.setState({
      name: event.target.value
        .trim().slice(0, 10)
    });
  };
  
  render() {
    return <input
      value={this.state.name}
      onChange={this.setName}
    />;
  }
}

ReactDOM.render(<App/>, document.body);
```

</td>
<td>

```jsx
class App extends React.Component {
  state = {
    name: ''
  };
  
  setName = event => {
    this.setState({
      name: event.target.value
        .trim().slice(0, 10)
    });
  };
  
  render() {
    return <reactFriendlyInput.Input
      value={this.state.name}
      onChange={this.setName}
    />;
  }
}

ReactDOM.render(<App/>, document.body);
```

</td>
</tr>
</tbody>
</table>

[Live demo](https://codepen.io/TheFinesse/pen/XqRVRL?editors=0010)


## Status

[![Build Status](https://travis-ci.org/Finesse/react-friendly-input.svg?branch=master)](https://travis-ci.org/Finesse/react-friendly-input)
[![dependencies Status](https://david-dm.org/Finesse/react-friendly-input/status.svg)](https://david-dm.org/Finesse/react-friendly-input)
[![devDependencies Status](https://david-dm.org/Finesse/react-friendly-input/dev-status.svg)](https://david-dm.org/Finesse/react-friendly-input?type=dev)
[![peerDependencies Status](https://david-dm.org/Finesse/react-friendly-input/peer-status.svg)](https://david-dm.org/Finesse/react-friendly-input?type=peer)


## Installation

There are several ways to install the components:

<details open>
<summary>Simple</summary>

Download the [plugin script](dist/react-friendly-input.umd.min.js) and import it using a `<script>` tag after the React 
import.

```html
<!-- React -->
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min.js"></script>

<!-- React Friendly Input -->
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/react-friendly-input@0.1.4/dist/react-friendly-input.umd.min.js"></script>
```
</details>

<details>
<summary>AMD/RequireJS</summary>

The script requires the following AMD modules to be available:

* `react` — React.

Installation:

```js
require.config({
  paths: {
    react: '//cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min',
    'react-friendly-input': '//cdn.jsdelivr.net/npm/react-friendly-input@0.1.4/dist/react-friendly-input.umd.min'
  }
});

define('myModule', ['react-friendly-input'], function (reactFriendlyInput) {
    // ...
});
```
</details>

<details>
<summary>Node.js/NPM/Yarn/Webpack/Rollup/Browserify</summary>

Install the package:

```bash
npm install react-friendly-input --save
```

Require it:

```js
const reactFriendlyInput = require('react-friendly-input');
```
</details>


## Usage

The components are rendered like the plain React form fields. All the props are passed to the underlying DOM elements.

```jsx
const {Input, TextArea, Select} = reactFriendlyInput;

ReactDOM.render(
  <div>
    <Input type="text" value="some value" />
    <TextArea value="big text" rows="4" />
    <Select value="1">
      <option value="0">No</option>
      <option value="1">Yes</option>
    <Select>
  </div>,
  document.body
);
```

If a field is focused, the field value doesn't change when a new value is given through the props.
The new value is applied as soon as the field loses the focus.

A component can be uncontrolled:

```jsx
const {Input} = reactFriendlyInput;

return <Input defaultValue="initial value" />;
```

You can change a field value using the `value` property. If the field is focused the value doesn't change.

```jsx
const {Input} = reactFriendlyInput;

let input;
ReactDOM.render(<Input defaultValue="value1" ref={i => input = i} />, document.body);
input.value = 'value2';
```

You can set a new value despite the focus using the `forceValue` method:

```jsx
input.forceValue('value2');
```

### Making a custom friendly input

If you have a component that acts like a form field:

* Its element has a writable `value` attribute
* Has the `defaultValue`, `onFocus` and `onBlur` props that acts the same as in the `<input>` component
* Uncontrolled when doesn't receive the `value` prop

You can use the [higher-order component](https://reactjs.org/docs/higher-order-components.html) function to make it 
friendly:

```js
const {palInput} = reactFriendlyInput;

class CustomField extends React.Component {
  // ...
}

const FriendlyCustomField = palInput(CustomField);
```

### Getting a reference to the DOM element

If you need to get a reference to the underlying element (e.g. to focus it), you have several options.

First is to use the friendly input `input` property:

```jsx
const {Input} = reactFriendlyInput;

return <Input ref={friendlyInput => friendlyInput.input.focus()} />;
```

Second is to use the `inputRef` prop:

```jsx
const {Input} = reactFriendlyInput;

return <Input inputRef={input => input.focus()} />; // String refs are not supported here
```


## Building and testing

The source code is located in the `src` directory. When you first download the code, install 
[node.js](https://nodejs.org/) version 8 or greater, open a console, go to the project root directory and run:
 
```bash
npm install
```

Run to compile the source code:

```bash
npm run build
```

Run to test:

```bash
npm test
```

Compile the code before testing because the test uses the compiled code. 
An Internet connection is required to test because multiple React versions are downloaded while testing.


## Versions compatibility

The project follows the [Semantic Versioning](http://semver.org).


## License

MIT. See [the LICENSE](LICENSE) file for details.
