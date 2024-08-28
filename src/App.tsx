import React from 'react';
import './App.css';
import { TodoStoreContext, todoStore } from './models/Todo';
import { HomePage } from './pages/home';
import { MobxQueryProvider } from './query/mobx-query-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <MobxQueryProvider>
      <TodoStoreContext.Provider value={todoStore}>
        <div className="App">
          <HomePage />
        </div>
      </TodoStoreContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </MobxQueryProvider>
  );
}

export default App;
