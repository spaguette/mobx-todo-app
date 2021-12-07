import React from "react";
import "./App.css";
import { TodoStoreContext, todoStore } from "./models/Todo";
import { HomePage } from "./pages/home";

function App() {
  return (
    <TodoStoreContext.Provider value={todoStore}>
      <div className="App">
        <HomePage />
      </div>
    </TodoStoreContext.Provider>
  );
}

export default App;
