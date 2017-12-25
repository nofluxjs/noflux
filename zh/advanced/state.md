# `state`

## 路径描述字符串（`path` ） {#path}

Noflux 中提供了一套遍历任意 `JavaScript` 对象的路径描述方式——**路径描述字符串**，通过使用点（`.`）分隔的路径描述字符串可以定位至对象的特定子节点，它的使用非常简单，就像直接访问 `JavaScript` 对象一样。例如对于这个对象：

```
{
  a: {
    b: [1, 2, 3],
  },
}
```

* `path = ''` 定位到根节点，即为 `{ a: { b: [1, 2, 3] } }`。

* `path ='a'` 定位到 `{ b: [1, 2, 3] }`。

* `path = 'a.b'` 定位到 `[1, 2, 3]`。

* 路径描述字符串同时支持数组下标，`path = 'a.b.1'` 定位到 `3`。

* 特别的，对于路径中含有 `.` 或 `~` 的路径，使用了类似 [JSON Pointer](http://tools.ietf.org/html/rfc6901) 的转义方式，即 `.` 转义为 `~0`、`~` 转义为 `~1`。

> 在接下来的文档中，所有变量、参数 `path` 均为指代路径描述字符串。

## `state.get([path = ''])`

`state.get` 接收一个可选路径描述字符串 `path`，它的默认值是`''`，代表状态树的根节点。

```js
state.set({ a: { b: { c: 1 } } });  // store an object tree in state: { a: { b: { c: 1 } } }
state.get();                        // return: { a: { b: { c: 1 } } }

state.get('a.b');                   // return: { c: 1 }
state.get('d.e');                   // return: undefined

state.get().a.b;                    // also return: { c: 1 }
state.get().d.e;                    // will throw TypeError: Cannot read property 'e' of undefined
```

正如最后一行代码所示，`state.get` 对于不存在的路径总会返回 `undefined`，而不是抛出异常。这使得在项目开发时不必过多做重复的初始化和判断工作。

`state.get`是获取内部状态树的推荐方法。虽然通过 `JavaScript` 的 `.` 也可以获取属性，但会损失一定的安全性和性能（详见：[部分监听](./connect.md#partial-connecting)）。

## `state.set([path = ''], value)`

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

需要注意，`state.set` 是改变内部状态树的推荐方法，直接使用点`.`修改属性（如 `state.get().a.b = 1`）将会造成组件不能正常渲染等问题。

## `state.update([path = ''], callback)`

`update` 方法提供了一种更加函数式的更新状态的方法，回调函数 `callback` 接收旧的状态值并应当返回新的状态值。

```js
state.set('a.b', 1);
state.update('a', obj => ({
  ...obj,
  c: 2,
}));
// equals to:
/*
state.set('a', {
  ...state.get('a'),
  c: 2,
});
*/
console.log(state.get()); // output: { a: { b: 1, c: 2 } }
```

## `state.cursor([path = ''])` {#cursor}

如果需要频繁读、写 `state` 特定路径下的数据，可以使用 `state.cursor` 使代码更加清晰。

`state.cursor` 返回一个 `State` 实例，这意味着可以对它进行 `get`、`set` 等操作，也可以再次调用 `cursor` 实现链式调用。

```js
const a = state.cursor('a');
a.get();                     // same as state.get('a')
a.cursor('b').set('c', 1);   // same as state.set('a.b.c', 1)
```
## 数组操作

因为 `Array.prototype.push` 等操作修改原数组会破坏 `state` 的不可变性。`state` 重新封装了这些操作，使其总是返回数组的新副本。

包括：

* `state.push(...items)`
* `state.pop()`
* `state.unshift(...items)`
* `state.shift()`
* `state.fill(value)`
* `state.reverse()`
* `state.splice(start, deleteCount, ...items)`

> 数组操作不支持 `path` 路径描述字符串，通常需要搭配 `state.cursor` 使用，如：

```js
state.set('a', [1, 2, 3]);
state.cursor('a').push(4, 5);        // object tree: { a: [1, 2, 3, 4, 5] }
state.cursor('a').splice(2, 1, 'a'); // object tree: { a: [1, 2, 'a', 4, 5] }
```
## 快照

得益于不可变性和写时复制，`state` 可以较低成本的实现快照功能。

调用 `state.snapshot()` 会将当前的状态树进行保存，调用以下方法可以实现“撤销”或“重做”。

* `state.canUndo()`
* `state.undo()`
* `state.canRedo()`
* `state.redo()`

需要注意，在调用 `undo` 或 `redo` 前务必使用 `canUndo` 或 `canRedo` 进行判断，超出快照范围的操作会抛出异常：`RangeError: no more snapshot available`。
