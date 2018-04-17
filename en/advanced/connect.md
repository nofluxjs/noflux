# `@connect`

## Principle

The core function Noflux using to re-render the component is [Component#forceUpdate](https://facebook.github.io/react/docs/react-component.html#forceupdate). Noflux change the component which is `@connect`ed to call `forceUpdate` automatically.

Therefore, `state.set` should only be called asynchronously, as in event listening or `Promise#then`. Invoking `forceUpdate` synchronously in [React component lifecycle](https://facebook.github.io/react/docs/react-component.html#updating) may cause infinite recursion.

## Partial Connecting {#partial-connecting}

All state management using **single source of truth** will face a performance problem when `state` growth large and nest deeply. The data for each component in a single page application (SPA) can be stored in a different sub-state. When one of them changes, it is necessary to avoid rendering other compoents.

> For example, in Redux you can use `mapStateToProps` control component observation to avoid all components re-rendering.

In Noflux, the component's observation of state changes is automatic and intelligent. **The component will only listen for the state it depends on** and other state changes do not cause the component to re-rende. This is called **partial connecting**。

The is an examples of partial connecting. Through `console.log` output you can find that the two components observe states separately and click event does not trigger another component re-render: ([https://codesandbox.io/s/Vm5mPRroX](https://codesandbox.io/s/Vm5mPRroX)):

```jsx
@connect
class ComponentA extends Component {
  render() {
    console.log('ComponentA render');
    return (
      <div>
        <button onClick={() => state.set('dateA', Date.now())}>
          Update
        </button>
        <p>
          Date A is {state.get('dateA')}
        </p>
      </div>
    );
  }
}

@connect class ComponentB extends Component {
  // almost same as ComponentA
}

export default class App extends Component {
  render() {
    return (
      <div>
        <ComponentA />
        <hr />
        <ComponentB />
      </div>
    )
  }
}
```

Due to the immutable `state`, `state.get()` will return a clone after any modification. So it's better to avoid calling `state.get()` in the component otherwise it will not be able to enjoy the performance benefits of partial connecting. A good suggestion is always useing `state.get(path)` to read state.

```js
// bad case
const { dataA, datab } = state.get();

// good case
const dataA = state.get('dataA');
const dataB = state.get('dataB');
```

> `@connect`'s partial connecting rely on [listener tree](https://github.com/nofluxjs/noflux-state/blob/master/src/listener-tree.js) in `@noflux/state` which use some algorithms to optimize the performance.
