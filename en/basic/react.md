# React

`@connect` is a decorator that connect React component and `state`: when `state` is modified synchronously or asynchronously, for example, ` state.set` is called, the components connected with `state` will be re-rendered.

In this case，`onChange` event triggers the modification of `name` in `state` then the component re-renders and display the value of   `name`. (Online debugging: [https://codesandbox.io/s/z47wLwP8](https://codesandbox.io/s/z47wLwP8))

```jsx
import React, { Component } from 'react';
import { connect, state } from '@noflux/react';

// init state
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

Use `state.set` directly outside the component to init state is ok because the component has not been instantiated yet.

## When to use

When should I use the `@connect` decorator?

The `@connect` decorator should be added to the component which `state.get` is used within. This means that the component will subscribe to the state changes and automatically re-render.

**Do not forget to add the `@connect` decorator to the component. Otherwise, the component may not re-render correct.**

> If you are familiar with [MobX] (https://mobx.js.org/), you will find that `@connect` is similar to `@observer` in MobX.

## Components design

Which component should use `@connect`? Or what kind of components should subscribe to the global state?

In Noflux, you are advice to use the same component design as Redux which divides components into container components and presentational components. You can find introductions of the design in [Redux documentation](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components) and [this article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). Here are the differences between the two components in Noflux:

|  | presentational components	| container components |
|--|--|--|
| Effect | How things look (markup, styles)|	How things work (data fetching, state updates) |
| Using `@connect` | No | Yes |
| To read state | `props` | `state.get` |
| To read state | `props` | `state.get` |
| To change data | callbacks in `props` | `state.set` etc. |

The advantage of this design is to make as few components as possible to subscribe to the global unique state and making the components easier to test and reuse.

## State design

Noflux does not limit the way you design the state and will not recommend a "best practice" for now.

As Noflux's interfaces and optimization, the design of state can be more free:

* Use [path description string](../advanced/state.md#path) and [state.cursor](../advanced/state.md#cursor) to easily manipulate the nested state.

* The `@connect` decorator use [partial connecting](../advanced/connect.md#partial-connecting) to avoid performance problem when sub-tree state changing.
