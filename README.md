# React Friendly Input

[![npm](https://img.shields.io/npm/v/react-friendly-input.svg)](https://www.npmjs.com/package/react-friendly-input)
![Supported React versions](https://img.shields.io/badge/React-v0.14,_v15,_v16-brightgreen.svg)
[![Build Status](https://travis-ci.org/FinesseRus/react-friendly-input.svg?branch=master)](https://travis-ci.org/FinesseRus/react-friendly-input)

This is a set of [React](https://reactjs.org) form field components which don't change their value programmatically 
when focused. It helps to build controlled inputs that don't annoy users.

Here is a simple example. It is a React application where a user can change his/her name. A name must not start or end 
with a space and must be not more then 10 characters long. The user is typing ` I am typing a text ` and pressing <kbd>Tab</kbd>.

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
class App extends React.Component
{
  state = {
    name: ''
  }
  
  setName(event) {
    this.setState({
      name: event.target.value
        .trim().slice(0, 10)
    });
  }
  
  render() {
    return <Input
      value={this.state.name}
      onInput={this.setName.bind(this)}
    />;
  }
}

ReactDOM.render(<App/>, document.body);
```

</td>
<td>

```jsx
class App extends React.Component
{
  state = {
    name: ''
  }
  
  setName(event) {
    this.setState({
      name: event.target.value
        .trim().slice(0, 10)
    });
  }
  
  render() {
    return <reactFriendlyInput.Input
      value={this.state.name}
      onInput={this.setName.bind(this)}
    />;
  }
}

ReactDOM.render(<App/>, document.body);
```

</td>
</tr>
</tbody>
</table>

[Demo on CodePen](https://codepen.io/TheFinesse/pen/XqRVRL?editors=0010)


## Installation

There are several ways to install the components:

<details open>
<summary>Simple</summary>

Download the [plugin script](dist/react-friendly-input.umd.min.js) and import it using a `<script>` tag after the React 
import.

```html
<!-- React -->
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/react@16.3.2/umd/react.production.min.js"></script>

<!-- React Friendly Input -->
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/react-friendly-input@0.1.0/dist/react-friendly-input.umd.min.js"></script>
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
        react: '//cdn.jsdelivr.net/npm/react@16.3.2/umd/react.production.min',
        'react-friendly-input': '//cdn.jsdelivr.net/npm/react-friendly-input@0.1.0/dist/react-friendly-input.umd.min'
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

```jsx
const {Input, TextArea, Select} = reactFriendlyInput;

ReactDOM.render(
    <div>
        <Input type="text" value="some value" />
        <TextArea value="big text" rows="4" />
        <Select value={1}>
            <option value="0">No</option>
            <option value="1">Yes</option>
        <Select>
    </div>,
    document.body
);
```

All the props are passed to the underlying DOM elements.

If a field is focused, the field value doesn't change when a new value is given through the props.
The new value is applied as soon as the field loses the focus.

A component can be uncontrolled:

```jsx
const {Input} = reactFriendlyInput;

return <Input defaultValue="initial value" />;
```

### Making a custom friendly input

If you have a component that acts like a form field (has the `value` property and emits `focus` and `blur` events),
you can use the [higher-order component function](https://reactjs.org/docs/higher-order-components.html) to make it 
friendly:

```js
const {palInput} = reactFriendlyInput;

class CustomField extends React.Component
{
    // ...
}

const FriendlyCustomField = palInput(CustomField);
```

### Getting an input reference

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
