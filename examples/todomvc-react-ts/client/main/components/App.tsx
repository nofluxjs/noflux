import * as React from 'react';
import { connect, state } from '@noflux/react'

import {
  Header,
  MainSection,
  model,
} from '../../todos';

import {
  SHOW_ALL,
  SHOW_ACTIVE,
} from '../../todos/constants/TodoFilters';

state.set({
  filter: SHOW_ALL,
  todos: [{
    id: Date.now(),
    text: 'Use Noflux',
    completed: false,
  }],
});

class App extends React.Component<void, void> {
  completeAll() {
    const todos:model.Todo[] = state.get('todos');
    const areAllMarked = todos.filter(todo => todo.completed).length === todos.length;
    state.set('todos', todos.map(todo => ({ ...todo, completed: !areAllMarked})));
  }

  render() {
    return (
      <div className="todoapp">
        <Header addTodo={(text) => state.cursor('todos').push({ id: Date.now(), text, completed: false })} />
        <MainSection
            todos={state.get('todos') as model.Todo[]}
            editTodo={(index, text) => state.set(`todos.${index}.text`, text)}
            deleteTodo={(index) => state.cursor('todos').splice(index, 1)}
            completeTodo={(index) => state.set(`todos.${index}.completed`, !state.get(`todos.${index}.completed`))}
            clearCompleted={() => state.set('todos', state.get('todos').filter(todo => !todo.completed))}
            completeAll={() => this.completeAll()}/>
      </div>
    );
  }
}

export default connect(App);
