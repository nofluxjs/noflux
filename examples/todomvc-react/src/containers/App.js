import React, { Component } from 'react';
import { connect, state } from '@noflux/react';
import {
  TODO_FILTERS,
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE,
} from '../constants/TodoFilters';
import Header from '../components/Header';
import MainSection from '../containers/MainSection';
import Footer from '../components/Footer';
import Info from '../components/Info';

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
          <MainSection />
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
