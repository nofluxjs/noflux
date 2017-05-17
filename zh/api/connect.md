# `@connect`

`@connect` 是一个修饰符，它在组件与 `state` 之间建立联系：当同步或异步的修改了 `state` 中的状态时——例如调用 `state.set` 或 `state.push`，依赖这部分状态的组件都会被重新渲染（通过运行 `forceUpdate` 调用 `render` 函数）。

例如在下面的例子中，`onChange` 事件的触发会修改 `state` 中 `name` 的值，该组件重新渲染并显示出 `name` 的值（在线调试： [https://codesandbox.io/s/z47wLwP8](https://codesandbox.io/s/z47wLwP8)。）：

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

## 使用时机

什么时候应该使用 `@connect` 修饰符？

当组件内使用了 `state.get` 时，就应该给这个组件添加 `@connect` 修饰符。这表示改组件会订阅状态的变化并自动重新渲染。

**不要忘记给组件添加 `@connect` 修饰符，否则这个组件将不能正常重新渲染。**

> 如果你熟悉 [MobX](https://mobx.js.org/) ，会发现 `@connect` 和 MobX 中的 `@observer`非常相像。

## 部分监听

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

> `@connect` 依靠 `@noflux/state` 包中的 **监听树** 实现部分监听，后者做了许多算法优化以保证性能。

## 组件设计

TODO
