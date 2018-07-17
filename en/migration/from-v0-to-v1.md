# Migration from `v0.x` to `v1.x`

After a long testing period in several production websites the Noflux project became stable and bugless and it is time to release the v1.x !

The aim of Noflux v1.x is providing a stable, reliable and pure state management library and
*keep it simple, stupid*.

It's very easy to upgrade Noflux v1 if you are using v0.x because few changes are introduced.

# Breaking changes

## API

Many [deprecated](./from-noflux-to-v0.md#deprecated) APIs are removed in v1.x, including:

* `state.load`
* `@pure`
* `@Connect`

## Event

The `change` event was removed and please use `set` instead.

# Non-breaking changes

## Component Support

`@connect` now support all React component types now:

* `Component`
* `PureComponent`
* Stateless Component
