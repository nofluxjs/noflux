# React

`@connect` 是一个修饰符，它在 React 组件与 `state` 之间建立联系：当同步或异步的修改了 `state` 中的状态时——例如调用 `state.set`——依赖这部分状态的组件都会被重新渲染。

例如在下面的例子中，`onChange` 事件的触发会修改 `state` 中 `name` 的值，该组件重新渲染并显示出 `name` 的值（在线调试： [https://codesandbox.io/s/z47wLwP8](https://codesandbox.io/s/z47wLwP8)。）：

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

对于状态的初始化直接在组件外使用 `state.set` 即可，此时组件还未实例化因此不会影响渲染。

## 使用时机

什么时候应该使用 `@connect` 修饰符？

当组件内使用了 `state.get` 时，就应该给这个组件添加 `@connect` 修饰符。这表示改组件会订阅状态的变化并自动重新渲染。

**不要忘记了给组件添加 `@connect` 修饰符，否则这个组件可能不会重新渲染。**

> 如果你熟悉 [MobX](https://mobx.js.org/) ，会发现 `@connect` 和 MobX 中的 `@observer`非常相像。

## 组件设计

什么样的组件应当使用 `@connect` 呢？或者说什么样的组件应当依赖全局状态呢？

Noflux 建议使用使用与 Redux 同样的组件设计思想，即将组件分为容器组件（Container）与展示组件（Presentational）。在 [Redux文档](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components) 和 [这篇文章](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 中有对这两种组件的介绍，这里列举下两种组件在 Noflux 中的区别：

|  | 展示组件	| 容器组件 |
|--|--|--|
|作用 | 描述如何展现（骨架、样式）|	描述如何运行（数据获取、状态更新）|
| 使用 `@connect` | 否 | 是 |
| 数据来源 | `props` | `state.get` |
| 数据修改 | `props` 中的回调函数 | `state.set` 等 |

这样设计的好处是使尽量少的组件依赖 Noflux 中全局唯一的状态，使组件更容易被测试和复用。

## 状态设计

Noflux 并不限制使用者使用何种方法设计状态，也暂时不会推荐某一种“最佳实践”。

但得益于 Noflux 的接口和优化，对状态的设计可以更加自由：

* 使用 [路径描述字符串](../advanced/state.md#path) 和 [state.cursor](../advanced/state.md#cursor) 可以方便的对嵌套状态进行操作
* `@connect` 使用 [部分监听](../advanced/connect.md#partial-connecting) 可以避免子树状态修改带来的性能问题
