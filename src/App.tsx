import React from 'react';
import './App.css';
import { TodoStoreContext, todoStore } from './models/Todo';
import { HomePage } from './pages/home';
import { MobxQueryProvider } from './query/mobx-query-provider';

function App() {
  return (
    <MobxQueryProvider>
      <TodoStoreContext.Provider value={todoStore}>
        <div className="App">
          <HomePage />
        </div>
      </TodoStoreContext.Provider>
    </MobxQueryProvider>
  );
}

export default App;
