# `state`

## Path Description String (`path`) {#path}

Noflux provides a way to traverse any JavaScript object, the "path description string". By using path description string separated with the dot (`.`) you can specific any child of the object as easy as accessing the object directly. For example:

```
{
  a: {
    b: [1, 2, 3],
  },
}
```

* `path = ''` locates to the root node, `{ a: { b: [1, 2, 3] } }`。

* `path ='a'` locates to `{ b: [1, 2, 3] }`。

* `path = 'a.b'` locates to  `[1, 2, 3]`。

* Path description string supports array index. `path = 'a.b.1'` locates to `3`。

* In particular, for paths that contain `.` or `~`, a similar way to [JSON Pointer](http://tools.ietf.org/html/rfc6901) is used. `.` is escaped to `~0` and `~` is escaped to `~1`.

> In the next document, the `path` in arguments and variables refer to the path description string.

## `state.get([path = ''])`

`state.get` receive an optional path description string `path` whose default value is `''`, which represents the root node of the state tree.

```js
state.set({ a: { b: { c: 1 } } });  // store an object tree in state: { a: { b: { c: 1 } } }
state.get();                        // return: { a: { b: { c: 1 } } }

state.get('a.b');                   // return: { c: 1 }
state.get('d.e');                   // return: undefined

state.get().a.b;                    // also return: { c: 1 }
state.get().d.e;                    // will throw TypeError: Cannot read property 'e' of undefined
```

As shown in the last line of code the `state.get` always return `undefined` for non-existent paths instead of throwing an exception. This makes it unnecessary to do so much repetitive initialization and judgment when developing.

`state.get` is the recommended way to get the internal state tree. Although using `.` directly also works but may loss performance. (See more here: [Partial Connecting](./connect.md#partial-connecting))

## `state.set([path = ''], value)`

As same as `state.get`，`state.set` receive an optional path description string `path`. In addition， `state.set` receive a `value` and "override" the state on the path.

```js
state.set({ a: {} });       // object tree: { a: {} }
state.set('a.b', 1);        // object tree: { a: { b: 1 } }
state.set('c.d', 's');      // object tree: { a: { b: 1 }, c: { d: 's' } }
```

`@noflux/state` implements the [Copy-on-write](https://zh.wikipedia.org/zh-cn/%E5%86%99%E5%85%A5%E6%97%B6%E5%A4%8D%E5%88%B6) in `JavaScript`. So all operations that modify the `state` will make a clone.

This means that `state` is immutable and can be used to implement snapshots, hot reloading, and so on.

```js
state.set('a.b', 1);
const obj1 = state.get();
state.set('a.c', 2);
const obj2 = state.get();
console.log(obj1 === obj2);  // output: false
```

It is important to note that `state.set` is the recommended method of changing the state. Using `.`directly, like `state.get().a.b = 1` will cause the component can not re-rendering as well.

## `state.update([path = ''], callback)`

The `update` method provides a more functional way to update state. The `callback` function receives the old value and should return the new value.

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

If you need to read and write specific path of `state`, you can use `state.cursor` to make the code clearer.

`State.cursor` returns an instance of `State`,
that can be `get`, `set`, and even `cursor` to implement chain call.

```js
const a = state.cursor('a');
a.get();                     // same as state.get('a')
a.cursor('b').set('c', 1);   // same as state.set('a.b.c', 1)
```
## Array methods

Because methods like `Array.prototype.push` will modify the original array and make `state` mutable. `state` wrapped these methods so they always return a clone of array.

Inlucding：

* `state.push(...items)`
* `state.pop()`
* `state.unshift(...items)`
* `state.shift()`
* `state.fill(value)`
* `state.reverse()`
* `state.splice(start, deleteCount, ...items)`

> Array methods don't support the path description string `path`. You can use it with `state.cursor`. For example:

```js
state.set('a', [1, 2, 3]);
state.cursor('a').push(4, 5);        // object tree: { a: [1, 2, 3, 4, 5] }
state.cursor('a').splice(2, 1, 'a'); // object tree: { a: [1, 2, 'a', 4, 5] }
```
## Snapshots

Thanks to immutable and copy-on-write `state`, it can be a lower cost to implement snapshots。

Calling `state.snapshot ()` will save the current state and call the following method to "undo" or "redo":

* `state.canUndo()`
* `state.undo()`
* `state.canRedo()`
* `state.redo()`

Note that it is important to use `canUndo` or` canRedo` before calling `undo` or `redo` otherwise exceeding the range of snapshots will throw an exception: `RangeError: no more snapshot available`。
