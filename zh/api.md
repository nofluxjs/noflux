# API

## `path` 路径描述字符串

Noflux 中提供了一套遍历任意 `JavaScript` 对象的路径描述方式——路径描述字符串，通过使用点（`.`）分隔的路径描述字符串可以定位至对象的特定子节点，它的使用非常简单，就像直接访问 `JavaScript` 对象一样。例如对于这个对象：

```
{
  a: {
    b: [1, 2, 3],
  },
}
```

* `path ='a'` 定位到 `{ b: [1, 2, 3] }`。

* `path = 'a.b'` 定位到 `[1, 2, 3]`。

* 路径描述字符串同时支持数组下标，`path = 'a.b.1'` 定位到 `3`。

* 特别的`path = ''` 定位到根节点，即为 `{ a: { b: [1, 2, 3] } }`。

在接下来的文档中，所有变量、参数 `path` 均为指代路径描述字符串。

## `state`

在一个 React 应用中，只有一个全局唯一的 `state`。它是 `@noflux/state` 中 `State` 类的实例。

```js
import { state } from '@noflux/react';
import { State } from '@noflux/state';

console.log(State.prototype.isPrototypeOf(state)); // output: true
```

`state` 内部维护了一棵 `Object` 组成的状态树，通常这是一个可以被序列化（如`JSON.stringify`）的对象，虽然不能序列化的对象也是可以接受的，但也无法享受同构渲染等优点。

### `state.get([path = ''])`

`state.get` 接收一个可选路径描述字符串 `path`，它的默认值是`''`，代表状态树的根节点。

```js
state.set({ a: { b: { c: 1 } } });  // store an object tree in state: { a: { b: { c: 1 } } }
state.get();                        // return: { a: { b: { c: 1 } } }

state.get('a.b');                   // return: { c: 1 }
state.get('d.e');                   // return: undefined

state.get().a.b;                    // also return: { c: 1 }
state.get().d.e;                    // will throw TypeError: Cannot read property 'e' of undefined
```

值得注意的是，正如最后一行代码所示，`state.get` 对于不存在的路径总会返回 `undefined`，而不是抛出异常。这使得在项目开发时不必过多做重复的初始化和判断工作。

`state.get`是获取内部状态树的推荐方法。虽然通过 `JavaScript` 的 `.` 也可以获取属性，但会损失一定的安全性和性能（详见：[性能](#)）。

### `state.set([path = ''], value)`

与 `state.get` 类似，`path`为可选的路径描述字符串。此外`state.set` 多接收一个参数 `value` 并使用这个值“覆盖”对应路径上的状态。

```js
state.set({ a: {} });       // object tree: { a: {} }
state.set('a.b', 1);        // object tree: { a: { b: 1 } }
state.set('c.d', 's');      // object tree: { a: { b: 1 }, c: { d: 's' } }
```

`@noflux/state` 实现了 `JavaScript` 的 [写时复制（Copy-on-write）](https://zh.wikipedia.org/zh-cn/%E5%86%99%E5%85%A5%E6%97%B6%E5%A4%8D%E5%88%B6)，因此所有修改 `state` 内部状态的操作都会产生一份新的副本。

这意味着 `state` 是不可变的（immutable），可以实现快照、热重载等功能。

```js
state.set('a.b', 1);
const obj1 = state.get();
state.set('a.c', 2);
const obj2 = state.get();
console.log(obj1 === obj2);  // output: false
```

需要注意，`state.set` 是改变内部状态树的**唯一**方法，直接使用点`.`修改属性（如 `state.get().a.b = 1`）将会造成不可预知的问题。

### `state.cursor`



## `connect`
