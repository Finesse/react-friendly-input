const {readFileSync} = require('fs');
const {expect} = require('chai');
const {JSDOM, VirtualConsole} = require('jsdom');

describe('Tests reactFriendlyInput', () => {

  const reactVersions = {
    '0.14': {
      reactUrl: 'https://cdn.jsdelivr.net/npm/react@0.14.0/dist/react.min.js',
      reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@0.14.0/dist/react-dom.min.js'
    },
    '15': {
      reactUrl: 'https://cdn.jsdelivr.net/npm/react@15.0.0/dist/react.min.js',
      reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@15.0.0/dist/react-dom.min.js'
    },
    '16': {
      reactUrl: 'https://cdn.jsdelivr.net/npm/react@16.0.0/umd/react.production.min.js',
      reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@16.0.0/umd/react-dom.production.min.js'
    },
    '16 latest': {
      reactUrl: 'https://cdn.jsdelivr.net/npm/react@16/umd/react.production.min.js',
      reactDomUrl: 'https://cdn.jsdelivr.net/npm/react-dom@16/umd/react-dom.production.min.js'
    }
    // When React 17 is released: `16 latest` should be removed and `17` with `17 latest` should be added
  };

  const reactFriendlyInputCode = readFileSync(`${__dirname}/../dist/react-friendly-input.umd.js`);

  // Run each test in the browser environment with every supported React version
  for (const [version, {reactUrl, reactDomUrl}] of Object.entries(reactVersions)) {
    describe(`React v${version}`, () => {
      let window, view, virtualConsole;

      before('init a DOM and load React', async function () {
        this.timeout(10000);

        // You can use it to debug: https://github.com/jsdom/jsdom#virtual-consoles
        virtualConsole = new VirtualConsole();
        virtualConsole.sendTo(console);

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
          pretendToBeVisual: true,
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
        expect(window.React).to.be.ok.and.to.be.an('object');
        expect(window.ReactDOM).to.be.ok.and.to.be.an('object');
        expect(window.reactFriendlyInput).to.be.ok.and.to.be.an('object');
      });

      it('has correct display name', () => {
        expect(window.reactFriendlyInput.palInput('input').displayName).to.equal('palInput(input)');
        expect(window.reactFriendlyInput.palInput('select').displayName).to.equal('palInput(select)');
        expect(window.reactFriendlyInput.palInput(class Foo extends window.React.Component {}).displayName).to.equal('palInput(Foo)');
      });

      it('renders an input', () => {
        window.ReactDOM.render(
          window.React.createElement(window.reactFriendlyInput.Input, {
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

      it('unmounts an input', () => {
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text'}), view);
        window.ReactDOM.unmountComponentAtNode(view);
        expect(view.childNodes).to.have.lengthOf(0);
      });

      it('lets change an input value through props when the input is not focused', () => {
        // Create an input
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'before'}), view);
        const input = view.firstElementChild;
        expect(input.value).to.equal('before');

        // Change the input value
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'after'}), view);
        expect(view.firstElementChild).to.equal(input);
        expect(input.value).to.equal('after');
      });

      it('doesn\'t let change an input value and selection through props when the input is focused', () => {
        // Create, focus and type in an input
        // The focus() method doesn't work if the input is not just created (it is not a fault of jsdom)
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'before focus'}), view);
        const input = view.firstElementChild;
        input.focus();
        expect(input).to.equal(window.document.activeElement); // Checks that the input is focused
        input.value += ' typing';
        input.selectionStart = 5;
        input.selectionEnd = 6;

        // Change the input value
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'while focus'}), view);
        expect(view.firstElementChild).to.equal(input);
        expect(input.value).to.equal('before focus typing');
        expect(input.selectionStart).to.equal(5);
        expect(input.selectionEnd).to.equal(6);
      });

      it('applies the value, passed through props while the input was focused, on blur', () => {
        // Create and focus an input
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'before focus'}), view);
        const input = view.firstElementChild;
        input.focus();
        expect(input).to.equal(window.document.activeElement);

        // Change the input value
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', value: 'while focus'}), view);
        expect(view.firstElementChild).to.equal(input);
        expect(input.value).to.equal('before focus');

        // Blur the input
        input.blur();
        expect(input).not.to.equal(window.document.activeElement);
        expect(input.value).to.equal('while focus');
      });

      it('doesn\'t change the input value in uncontrolled mode', () => {
        // Create an input
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'text', defaultValue: 'abc'}), view);
        const input = view.firstElementChild;
        expect(input.value).to.equal('abc');

        // Type in the input
        input.value += 'de';
        expect(input.value).to.equal('abcde');

        // Focus the input and type
        input.focus();
        expect(input).to.equal(window.document.activeElement);
        input.value += 'f';
        expect(input.value).to.equal('abcdef');

        // Blur the input
        input.blur();
        expect(input).not.to.equal(window.document.activeElement);
        expect(input.value).to.equal('abcdef');
      });

      it('provides a ref to the wrapped component through callback', () => {
        // Ref to a newly rendered element
        let refInput1 = null;
        window.ReactDOM.render(
          window.React.createElement(window.reactFriendlyInput.Input, {
            type: 'checkbox',
            inputRef: input => refInput1 = input
          }),
          view
        );
        const domInput = view.firstElementChild;
        expect(refInput1).not.to.equal(null);
        expect(refInput1).to.equal(domInput);

        // Change the ref
        let refInput2 = null;
        window.ReactDOM.render(
          window.React.createElement(window.reactFriendlyInput.Input, {
            type: 'checkbox',
            inputRef: input => refInput2 = input
          }),
          view
        );
        expect(refInput1).to.equal(null);
        expect(refInput2).not.to.equal(null);
        expect(refInput2).to.equal(domInput);
      });

      it('provides a ref to the wrapped component through React.createRef()', function () {
        // createRef() appeared in React 16.3 https://reactjs.org/blog/2018/03/29/react-v-16-3.html#createref-api
        if (typeof window.React.createRef !== 'function') {
          this.skip();
          return;
        }

        const ref = window.React.createRef();
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {type: 'checkbox', inputRef: ref}), view);
        const domInput = view.firstElementChild;
        expect(ref.current).not.to.equal(null);
        expect(ref.current).to.equal(domInput);
      });

      it('provides a ref to the wrapped component through `input` property', () => {
        let refInput = null;
        window.ReactDOM.render(
          window.React.createElement(window.reactFriendlyInput.Input, {
            type: 'radio',
            ref: input => refInput = input
          }),
          view
        );
        const domInput = view.firstElementChild;
        expect(refInput.input).not.to.equal(null);
        expect(refInput.input).to.equal(domInput);
      });

      it('provides the built-in components', () => {
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
        const MyFriendlyComponent = window.reactFriendlyInput.palInput(MyComponent);

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
            onFocus(event) {
              expect(event).to.have.property('type', 'focus');
              ++focusCount;
            },
            onBlur(event) {
              expect(event).to.have.property('type', 'blur');
              ++blurCount;
            },
            onInput(event) {
              expect(event).to.have.property('type', 'input');
              ++inputCount;
            },
            onClick(event) {
              expect(event).to.have.property('type', 'click');
              ++clickCount;
            }
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

        input.dispatchEvent(new window.Event('input', {bubbles: true, cancelable: true}));
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

      it('renders children', () => {
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Select, {}, [
          window.React.createElement('option', {value: 1}, 'Foo'),
          window.React.createElement('option', {value: 2}, 'Bar')
        ]), view);
        const select = view.firstElementChild;
        expect(select.children).to.have.lengthOf(2);
        expect(select.children[0].tagName).to.equal('OPTION');
        expect(select.children[0].value).to.equal('1');
        expect(select.children[0].textContent).to.equal('Foo');
      });

      it('returns the value through the `value` getter', () => {
        let friendlyInput;
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {
          value: 'orange',
          ref: input => friendlyInput = input
        }), view);
        expect(friendlyInput.value).to.equal('orange');
      });

      it('sets a value through the `value` setter', () => {
        let friendlyInput;
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {
          value: 'apple',
          ref: input => friendlyInput = input
        }), view);
        friendlyInput.value = 'banana';
        expect(view.firstElementChild.value).to.equal('banana');
      });

      it('doesn\'t let change the input value through the `value` setter when the input is focused', () => {
        let friendlyInput;
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {
          defaultValue: 'apple',
          ref: input => friendlyInput = input
        }), view);

        const domInput = view.firstElementChild;
        domInput.focus();
        friendlyInput.value = 'banana';
        expect(domInput.value).to.equal('apple');

        domInput.blur();
        expect(domInput.value).to.equal('apple');
      });

      it('lets change the input value using the `forceValue` method when the input is focused', () => {
        let friendlyInput;
        window.ReactDOM.render(window.React.createElement(window.reactFriendlyInput.Input, {
          defaultValue: 'apple',
          ref: input => friendlyInput = input
        }), view);

        const domInput = view.firstElementChild;
        domInput.focus();
        friendlyInput.forceValue('banana');
        expect(domInput.value).to.equal('banana');

        domInput.blur();
        expect(domInput.value).to.equal('banana');
      });

      afterEach('clean up', () => {
        window.ReactDOM.unmountComponentAtNode(view);
        view.innerHTML = '';
      });

      after('destroy the DOM', () => {
        window.close();
      });
    });
  }
});
