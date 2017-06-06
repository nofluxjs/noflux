# Migration

Migrating from `noflux`.

## Background

Noflux's predecessor was the `noflux` project (NPM：[noflux](https://www.npmjs.com/package/noflux)，Github：[ssnau/noflux](https://github.com/ssnau/noflux)). Noflux's concepts were mainly learned from the latter, and Noflux's development was supported by the `noflux` developer [ssnau](https://github.com/ssnau).

Noflux is made up of several NPM packages with a certain dependency. To prevent confusion with the `noflux` project, these packages are **prefixed by [@noflux](https://www.npmjs.com/org/noflux)**.

## New Features

It is highly recommended that `noflux` users should migrate to Noflux because it offers a lot of new features:

* `state.cursor` is [isomorphic](./state.md#cursor) to `state`.
* `@connect` use [partial connect](./connect.md#partial-connect) to avoid a lot of repetitive re-rendering and improve rendering performance.
* [Completely refactored listener tree](https://github.com/nofluxjs/noflux-state/pull/10) has been fully tested and optimized performance.

## Migration list

### Breaking changes

* `state.cursor`

Unlike `noflux`, `state.cursor` returns a `State` instance from [@noflux/state](https://www.npmjs.com/package/@noflux/state). So you can do this for the `state.cursor` instance, `.set`, `.get`, `.cursor`, and so on.

Migrate as follows：

| Operating | `noflux` | Noflux |
| --- | --- | --- |
| Get cursor| `const cursor = state.cursor('a.b')` | `const cursor = state.cursor('a.b')` |
| Get state | `cursor()` | `cursor.get()` |
| Change state | `cursor.update(value)` | `cursor.set('value')` |
| Change state | `cursor.update(fn)` | No longer supported, please use `.get` and `.set` |
| Get ext cursor | - | `cursor.cursor('c.d')` |

* `cursor.mergeUpdate`

Do not support any operations that require deep cloning, use `cursor.set` instead.

* `state.toJS`

Use `state.get()` instead

### Non-breaking change

* `state.on` and `cursor.on`

Noflux has adjusted event names, but is still compatible whthin `noflux`.

More details in [this pull-request](https://github.com/nofluxjs/noflux-state/pull/11).

> **Note：The `update` event in the official version (1.x) is retained yet to be determined.  It is recommended to use the `set` event instead. If you still need `update` event please issue [here](https://github.com/nofluxjs/noflux-state/issues/new).**

### Deprecated

> **Note: All deprecated API may be removed from subsequent releases. Please migrate as soon as possible**

* `state.load`

Use `state.set(data)` instead. The deprecated one can still be used but will output the following information:

```
Warning: state.load(data) is deprecated, use state.set(data) or state.set(\'\', data).
```

* `@pure`

[React version 15.3.0](https://github.com/facebook/react/blob/master/CHANGELOG.md#1530-july-29-2016) introduced  [PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent)，So it is recommended to use `PureComponent` directly in `15.3.0` and later versions. The `@pure` decorator can still be used but will output the following information:

```
Warning: @pure is deprecated, use React.PureComponent instead. https://facebook.github.io/react/docs/pure-render-mixin.html
```

* `@Connect`

Use `@connect` instead，The deprecated one can still be used but will output the following information:

```
Warning: @Connect is deprecated, use @connect instead.
```
