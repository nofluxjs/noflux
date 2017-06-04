# Getting started

## Installation

Install `@noflux/react` package by using [npm](https://www.npmjs.com/):

```bash
npm install @noflux/react
```

## Example

Here is an Noflux app example. You can also debug it online: [https://codesandbox.io/s/z47wLwP8](https://codesandbox.io/s/z47wLwP8).

```jsx
import React, { Component } from 'react';
import { connect, state } from '@noflux/react';

state.set({
  name: 'jack',
});

@connect
export default class App extends Component {
  render() {
    return (
      <div>
        <input onChange={e => state.set('name', e.target.value)} />
        <p> Hello, my name is {state.get('name')} </p>
      </div>
    )
  }
}
```

## Syntax

The `connect` in Noflux is a "decorator" in ES Next [proposal](https://tc39.github.io/proposal-decorators/) but  also can run in the ES5 environment:

```jsx
class App extends Component {
  //...
}
export default connect(App);
```

If you use a JavaScript compiler like [Babel](https://babeljs.io/), you can use `@connect` decorator with a sample configuration. Run this command to install decorators plugin:

```bash
npm install --save-dev babel-plugin-transform-decorators-legacy
```

And modify the `.babelrc` file to enable the plugin:

```js
{
  "plugins": ["transform-decorators-legacy"]
}
```

> Code examples in the rest documents will be written using decorators syntax.

## Interfaces

Noflux exports a few interfaces, only `state` and `connect`。

* `state` maintains a globally unique state and provides methods suck as `get` and `set` for state modification.

> Noflux uses **single source of truth** and provide an immutable `state`, that is similar to [Redux](http://redux.js.org/).

* `connect` will track changes in `state` and re-render components intelligently.

> A component will be re-rendered via [forceUpdate](https://facebook.github.io/react/docs/react-component.html#forceupdate), meaning its `render` method will be called if the value from `state.get` was changed.

# Next steps

I believe you have had a preliminary impression of Noflux. Let's enter the next chapter: [basic](./basic/index.md).
