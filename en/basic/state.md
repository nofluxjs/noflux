# State

"State" should be stored whithin a JavaScript `Object Tree` in the Noflux application. The state should be:

* Immutable
* Globally unique（single source of truth）
* Serializable（not required）

> Noflux and Redux have the same concept of state management.

## Immutable

The immutable state means that you shouldn't modify but create a copy of the state. So it could be convenient to make hot reloading, snapshot and so on.

There are many ways to implement an "immutable object" such as using [Immutable.js](https://facebook.github.io/immutable-js/), `Object.assign` in ES2015 and spread operator(`...`) in ES2016. Here is an example:

```js
const originObj = {
  a: 1,
  b: '2',
  c: { v: 3},
};
const newObj = { ...originObj, d: 4};
```

That object clone implementation is widely used in `Redux` but would be complicated when modifying deeply nested state, for example [here](http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html#correct-approach-copying-all-levels-of-nested-data) or this sample:

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

Changing deeply nested state is simple in the Noflux application by using `state.get` and `state.set`:

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

Noflux provices immutable operators for not only `Object` but also `Array`. For example, `state.get('a.b.c.1')` will return `2`. The string describing the operation path in arguemnts is called "path description string" (more usage [here](../advanced/state.md#path)).

> The implementation of `state` is in `@noflux/state` package ([NPM](https://www.npmjs.com/package/@noflux/state), [Github](https://github.com/nofluxjs/noflux-state)) which provides state management and event listening for Noflux.

## single source of truth

Noflux the global unique state, the **single source of truth** one, which is why you don't need to use `new` to create `state` but directly import it.

```js
import { state } from '@noflux/react';
```

Since the `state` is held by the closure within `@noflux/react`, you can import it in any `.js` (or `.jsx`) file. No need to use any "magic" to get a reference to the `state`, suck as [Context](https://facebook.github.io/react/docs/context.html).

Using the single source of truth state avoids the complexity of management of state fragmentation, and it can easily implement hot reloading or snapshots.

But it also means that any changing of state will create a new object tree and trigger the component re-rendering. As the state becomes more complex, the rendering time of the page doubles.

Don't worry, Noflux `state` use Copy-on-write to reduce the cost of duplicating and `@connect` decorator can intelligently avoid the useless re-rendering. The optimization of performance will be described in more detail later.

## Serializable

`State` maintains an object tree, which is usually a plain object that can be serialized (eg` JSON.stringify`). Generally these parameters should not be passed to `state.set`:

* `Function` or `Class`
* Object with `getter` 或 `setter`
* Inherited object

> Because Noflux uses the object and array spread operator, `{ ...obj }` and `[...arr]`, only `Own Property` will be clone.

There are more advantages to using serializable state:

* Stored in `localStorage` and `sessionStorage`
* Isomorphic rendering
* Avoid complex `this` references in nesting objects.

# Next steps

Next, let's have a look at relationship between the state and components: [React](./react.md).
