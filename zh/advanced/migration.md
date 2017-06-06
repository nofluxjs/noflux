# 迁移

从 `noflux` 迁移。

## 背景

Noflux 的前身是 `noflux` 项目（NPM：[noflux](https://www.npmjs.com/package/noflux)，Github：[ssnau/noflux](https://github.com/ssnau/noflux))，Noflux 的思想主要借鉴自后者 ，同时 Noflux 的开发得到了 `noflux` 开发者 [ssnau](https://github.com/ssnau) 的大力支持。

Noflux 由几个有一定依赖关系的 NPM 包组成，为防止与 `noflux` 项目混淆，这些包 **都以 [@noflux](https://www.npmjs.com/org/noflux) 为前缀**。

## 新功能

非常建议 `noflux` 用户迁移到 Noflux，因为相比于前者，后者提供了很多新的功能：

* `state.cursor` 与 `state` [同构](./state.md#cursor)。
* `@connect` [部分监听](./connect.md#partial-connect) 可以避免大量重复渲染，从而提高 `render` 性能。
* [完全重构的监听树](https://github.com/nofluxjs/noflux-state/pull/10)，进行了充分的性能测试和优化。

## 迁移列表

### 破坏性变化

* `state.cursor`

与 `noflux` 不同，`state.cursor` 将返回一个 `State` 实例（来自 [@noflux/state](https://www.npmjs.com/package/@noflux/state)），因此可以对 `state.cursor` 的接口进行 `.set`、`.get`、`.cursor` 等操作。

迁移方法如下：

| 操作 | `noflux` | Noflux |
| --- | --- | --- |
| 获取游标 | `const cursor = state.cursor('a.b')` | `const cursor = state.cursor('a.b')` |
| 读取状态 | `cursor()` | `cursor.get()` |
| 写入状态 | `cursor.update(value)` | `cursor.set('value')` |
| 写入状态（利用回调）| `cursor.update(fn)` | 不再支持，请使用 `.get` 和 `.set` |
| 下一级游标 | - | `cursor.cursor('c.d')` |

* `cursor.mergeUpdate`

不在支持任何需要深克隆的操作，请使用 `cursor.set` 替代。

* `state.toJS`

请使用 `state.get()` 代替。

### 非破坏性变化

* `state.on` 与 `cursor.on`

Noflux 对事件进行了调整，但依旧兼容 `noflux` 中的事件名。

详细请见 [这个Pull-request](https://github.com/nofluxjs/noflux-state/pull/11)。

> **注意：`update` 事件在正式版（1.x）是否保留尚未确定，建议使用 `set` 事件替代，如对该事件有依赖请发 [issue](https://github.com/nofluxjs/noflux-state/issues/new) 进行讨论**

### 废弃

> **注意：所有废弃接口可能在后续版本中移除，请尽快进行迁移**

* `state.load`

建议使用 `state.set(data)` 替代，原接口仍可使用但会输出如下信息：

```
Warning: state.load(data) is deprecated, use state.set(data) or state.set(\'\', data).
```

* `@pure`

[React 15.3.0 版本](https://github.com/facebook/react/blob/master/CHANGELOG.md#1530-july-29-2016) 引入了 [PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent)，因此在 `15.3.0` 及其之后的版本建议直接使用 `PureComponent`，`@pure` 修饰符仍可使用但会输出如下信息：

```
Warning: @pure is deprecated, use React.PureComponent instead. https://facebook.github.io/react/docs/pure-render-mixin.html
```

* `@Connect`

建议使用 `@connect` 替代，原接口仍可使用但会输出如下信息：

```
Warning: @Connect is deprecated, use @connect instead.
```
