import React, { Component } from 'react';
import { connect, state } from '@noflux/react';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from './constants/TodoFilters'
import Header from './components/Header';
import TodoItem from './components/TodoItem';
import Footer from './components/Footer';
import Info from './components/Info';
import './App.css';

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: ({ completed }) => !completed,
  [SHOW_COMPLETED]: ({ completed }) => completed,
}

state.set({
  filter: SHOW_ALL,
  todos: [{
    id: Date.now(),
    text: 'Use Noflux',
    completed: false,
  }],
});

class App extends Component {

  completeAll() {
    const todos = state.get('todos');
    const areAllMarked = todos.filter(TODO_FILTERS[SHOW_COMPLETED]).length === todos.length;
    state.set('todos', todos.map(todo => ({ ...todo, completed: !areAllMarked})));
  }

  render() {
    const todos = state.get('todos');
    return (
      <div>
        <section className="todoapp">
          <Header
            addTodo={(text) => state.cursor('todos').push({ id: Date.now(), text, completed: false })}
          />
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
                  todo={todo}
                  editTodo={(id, text) => state.set(`todos.${index}.text`, text)}
                  deleteTodo={(idDeleted) => state.set('todos', state.get('todos').filter(({ id }) => id !== idDeleted))}
                  completeTodo={() => state.set(`todos.${index}.completed`, !todo.completed)}
                />
              ))}
            </ul>
          </section>
          {Boolean(todos && todos.length) &&
            <Footer
              completedCount={todos.filter(TODO_FILTERS[SHOW_COMPLETED]).length}
              activeCount={todos.filter(TODO_FILTERS[SHOW_ACTIVE]).length}
              filter={state.get('filter')}
              onClearCompleted={() => state.set('todos', todos.filter(TODO_FILTERS[SHOW_ACTIVE]))}
              onShow={(filter) => state.set('filter', filter)}
            />
          }
        </section>
        <Info />
      </div>
    );
  }
}

export default connect(App);
