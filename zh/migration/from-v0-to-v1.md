# 从`v0.x`到`v1.x`

经过长时间在线上业务的检验，Noflux项目逐渐稳定和健壮，现在是时间发布 v1.x 版了！

Noflux v1.x 的目标是提供稳定、可靠、简单的状态管理库，它满足 KISS 原则 ( keep it simple, stupid )。

如果你在使用v0.x版本，那么升级到v1将非常简单，因为它只引入了很少的变化。

# 破坏性变化

## API

v1.x 删除了一些[废弃的](./from-noflux-to-v0.md#deprecated) API，包括:

* `state.load`
* `@pure`
* `@Connect`

## 事件

删除了 `change` 事件，请使用 `set` 事件替代。

# 非破坏性变化

## 组件支持

`@connect` 现在支持所有 React 组件类型：

* `Component`
* `PureComponent`
* Stateless Component
