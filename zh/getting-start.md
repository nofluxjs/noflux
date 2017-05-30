# 入门

## 安装

使用 [npm](https://www.npmjs.com/) 命令，安装`@noflux/react`包：

```bash
npm install @noflux/react
```

Noflux 使用ES Next中的“修饰器”（decorators），需要运行这条命令安装对修饰器插件：

```bash
npm install --save-dev babel-plugin-transform-decorators-legacy
```

然后修改 `.babelrc` 文件开启该插件：

```js
{
  "plugins": ["transform-decorators-legacy"]
}
```

## 例子

这是一个使用 Noflux 的简单例子。你也可以在线调试它：[https://codesandbox.io/s/z47wLwP8](https://codesandbox.io/s/z47wLwP8)。

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

## 接口

Noflux 所暴露的接口非常少，准确讲只有`state`与`connect`。

* `state` 维护着全局唯一的状态，并提供如 `get`、`set` 之类的接口供数据操作。

> 与 [Redux](http://redux.js.org/) 类似，Noflux 使用 **单一数据源** ，且 `state` 是不可变的（immutable）——虽然它的操作方法看起来不像。

* `connect` 将感知 `state` 的变化并智能的重新渲染组件。

> 如果一个组件通过 `state.get` 获取的值被修改了，那么这个组件将通过 [forceUpdate](https://facebook.github.io/react/docs/react-component.html#forceupdate) 被重新渲染，这意味着它的 `render` 方法将会被调用。

# 接下来

相信你已经对 Noflux 有了初步的印象，接下来请请阅读下一章节：[基础](./basic/index.md)。
