# 状态

在 Noflux 应用中，“状态”应该被存储在一棵 JavaScript 对象树（Object Tree）中，状态应当是：

* 不可变的（Immutable）
* 全局唯一的（单一数据源）
* 可被序列化的（但不一定完全是）

> 如果你使用过 Redux，会发现它与 Noflux 在状态管理上有着同样的思想。

## 不可变

不可变的（Immutable）状态意味着不应当直接修改原始状态，而应当在修改时创建状态的副本。它的好处是可以方便的实现热重载、历史快照等功能。

有许多方式可以实现一个“不可变对象”，如使用 [Immutable.js](https://facebook.github.io/immutable-js/) 这样的库，或是使用 ES2015 的 `Object.assign` 以及 展开运算符（`...`）。下面是一个例子：

```js
const originObj = {
  a: 1,
  b: '2',
  c: { v: 3},
};
const newObj = { ...originObj, d: 4};
```

这种创建对象副本的方式在 Redux 中经常被使用，但在对较深层次进行修改时会变得很复杂，如[这里](http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html#correct-approach-copying-all-levels-of-nested-data)和下面的例子：

```js
const originObj = {
  a: {
    b: {
      c: [1, 2, 3],
      d: 4,
    },
  },
};
const newObj = {
  ...originObj,
  a: {
    ...originObj.a,
    b: {
      ...originObj.b,
      d: 3,
    },
  },
};
```

在 Noflux 中对于深层嵌套的修改会很简单，使用 `state.get` 和 `state.set` 可以轻易的实现状态读写。

```js
import { state } from '@noflux/react';
state.set({
  a: {
    b: {
      c: [1, 2, 3],
      d: 4,
    },
  },
});
state.set('a.b.d', 5);  // same as clone(originObj).a.b.d = 3
state.get();            // return the modified object
```

不仅针对对象，`state` 同时提供了对于数组的读写所需要的“不可变”操作函数，例如 `state.get('a.b.c.1')`，将返回 `2`。这种描述对象操作的字符串被称为“路径描述字符串”，它的具体用法可见 [API - state](../api/state.md#path)。

> `state` 对象来自 `@noflux/state` 包（[NPM](https://www.npmjs.com/package/@noflux/state)、[Github](https://github.com/nofluxjs/noflux-state)），它封装了 Noflux 所需的状态管理与事件监听。

## 单一数据源

Noflux 使用 **单一数据源** ，在一个 Noflux 应用中通常只有一个全局唯一的 `state`，这也是为什么我们不需要使用 `new` 创建 `state` 而直接引入即可：

```js
import { state } from '@noflux/react';
```

由于 `state` 是通过闭包在 `@noflux/react` 中保持的，你可以在任何 `.js`（或 `.jsx`） 文件中使用它。在 Noflux 中无需使用 [Context](https://facebook.github.io/react/docs/context.html) 等黑科技获取对 `state` 的引用。

使用单一数据源的好处在于可以避免状态分散带来管理上的复杂度，同时不可变的、单一的数据源可以方便的实现热重载或历史快照。

但这也意味着任何状态的修改都会创建一个新的对象树，而状态的改变又会触发界面的重新渲染（Re-rendering），随着状态越来越复杂，页面的渲染时间会成倍增加。

不过不用担心，在 Noflux 使用“写时复制”（Copy-on-write）技术降低创建副本的成本以及 `@connect` 修饰符智能的避免页面无用的重渲染。对于性能的优化在后文中将做更详细的介绍。

## 序列化

`state` 内部维护了一棵对象树，通常这是一个可以被序列化（如`JSON.stringify`）的纯对象，这意味着通常不应该向 `state.set` 中传入：

* 函数（`Function`） 或 类（`Class`）
* `getter` 或 `setter`
* 具有原型链的的对象

> 这是因为 Noflux 内部使用了 对象展开运算符（`{ ...obj }`）和数组展开运算符（`[...arr]`）实现，因此只有 `Own Property` 才会被克隆。

使用可序列化的状态树还有很多好处：

* 存储于 `localStorage` 或 `sessionStorage`
* 用于同构渲染
* 避免嵌套对象中复杂的 `this`

# 下一步

了解了状态的存储与修改，接下来看一下状态是如何与界面相关联的：[React](./react.md)。
