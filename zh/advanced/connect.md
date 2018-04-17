# `@connect`

## 原理

Noflux 重新渲染组件的核心方法是 [Component#forceUpdate](https://facebook.github.io/react/docs/react-component.html#forceupdate)，通过 `@connect` 修饰符 Noflux 可以对组件进行修改，从而实现对 `forceUpdate` 的自动调用。

因此，只应当异步的调用 `state.set`——如在事件监听中或在 `Promise#then` 中，在 [组件更新的声明周期](https://facebook.github.io/react/docs/react-component.html#updating) 中同步的调用 `forceUpdate` 可能造成无限递归。

## 部分监听 {#partial-connecting}

对于使用 **单一数据源** 的状态管理实现，都会面对 `state` 过大且子状态较多时产生的性能问题。在单页面应用中各个模块的数据可能存放在不同子状态中，当其中一个模块的状态改变时，需要避免其他模块被重新渲染。

> 例如在 Redux 中需要使用 `mapStateToProps` 控制组件对子状态的监听，以避免状态改变造成所有组件重新渲染。

在 Noflux 中组件对于状态改变的监听是自动且智能的，**组件只会监听它依赖的状态**，其他子状态的改变不会引起该组件重新渲染。这种监听方式被称为 **部分监听**。

下面是一个部分监听的例子，通过这个例子的 `console.log` 输出可以看到，两个组件分别监听各自的子状态，点击事件不会触发另一个组件更新（完整代码见在线调试：[https://codesandbox.io/s/Vm5mPRroX](https://codesandbox.io/s/Vm5mPRroX)）：

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

由于 `state` 的不可变性，任何状态修改后 `state.get()` 都将返回一个新的对象，因此应该避免在组件中调用 `state.get()` 获取数据，否则将无法享受部分监听带来的性能优化。一个比较好的建议是所有对状态的读操作都是用 `state.get(path)` 的路径描述字符串完成。

```js
// bad case
const { dataA, datab } = state.get();

// good case
const dataA = state.get('dataA');
const dataB = state.get('dataB');
```

> `@connect` 依靠 `@noflux/state` 包中的 [监听树](https://github.com/nofluxjs/noflux-state/blob/master/src/listener-tree.js) 实现部分监听，后者做了许多算法优化以保证性能。
