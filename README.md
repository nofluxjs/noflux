# Noflux

*Simple, stupid state management for JavaScript apps.*

## Packages

| Package | Version | Dependencies | DevDependencies | Build |
|--------|-------|------------|----------|----------|
| [@noflux/state](https://github.com/nofluxjs/noflux-state) | [![npm (scoped)](https://img.shields.io/npm/v/@noflux/state.svg?maxAge=86400)](https://www.npmjs.com/package/@noflux/state) | [![Dependency Status](https://david-dm.org/nofluxjs/noflux-state.svg)](https://david-dm.org/nofluxjs/noflux-state) | [![devDependency Status](https://david-dm.org/nofluxjs/noflux-state/dev-status.svg)](https://david-dm.org/nofluxjs/noflux-state?type=dev) | [![Build Status](https://travis-ci.org/nofluxjs/noflux-state.svg?branch=next)](https://travis-ci.org/nofluxjs/noflux-state) |
| [@noflux/react](https://github.com/nofluxjs/noflux-react) | [![npm (scoped)](https://img.shields.io/npm/v/@noflux/react.svg?maxAge=86400)](https://www.npmjs.com/package/@noflux/react) | [![Dependency Status](https://david-dm.org/nofluxjs/noflux-react.svg)](https://david-dm.org/nofluxjs/noflux-react) | [![devDependency Status](https://david-dm.org/nofluxjs/noflux-react/dev-status.svg)](https://david-dm.org/nofluxjs/noflux-react?type=dev) | [![Build Status](https://travis-ci.org/nofluxjs/noflux-react.svg?branch=next)](https://travis-ci.org/nofluxjs/noflux-react) |

## Example

Online debugging: [https://codesandbox.io/s/z47wLwP8](https://codesandbox.io/s/z47wLwP8).

```jsx
import React, { Component } from 'react';
import { connect, state } from '@noflux/react';

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

## Documentations

* [English](https://noflux.js.org/en/)
* [简体中文](https://noflux.js.org/zh/)
