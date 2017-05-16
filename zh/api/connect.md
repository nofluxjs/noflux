# `@connect`

`@connect`

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
