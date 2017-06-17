import React, { Component } from 'react';
import { connect, state } from '@noflux/react';
import {
  TODO_FILTERS,
  SHOW_COMPLETED,
} from '../constants/TodoFilters';
import TodoItem from '../components/TodoItem';

class MainSection extends Component {
  render() {
    const todos = state.get('todos');
    return (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          checked={todos.filter(TODO_FILTERS[SHOW_COMPLETED]).length === todos.length}
          onChange={() => this.completeAll()}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todos.filter(TODO_FILTERS[state.get('filter')]).map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              editTodo={(id, text) => state.set(`todos.${index}.text`, text)}
              deleteTodo={(idDeleted) => state.set('todos', state.get('todos').filter(({ id }) => id !== idDeleted))}
              completeTodo={() => state.set(`todos.${index}.completed`, !todo.completed)}
            />
          ))}
        </ul>
      </section>
    )
  }
}

export default connect(MainSection);
