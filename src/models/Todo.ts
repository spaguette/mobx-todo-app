import { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';
import { createTodoItemQuery, putTodo, todoListQuery } from './todo-api';

export interface ITodoData {
  id: string;
  text: string;
  done?: boolean;
}

// Not a MobX entity!!
export class Todo implements ITodoData {
  id: string;
  text: string;
  done?: boolean;

  constructor({ id, text, done = false }: ITodoData) {
    this.id = id;
    this.text = text;
    this.done = done;
  }

  toggle = () => {
    putTodo.mutate({ ...this, done: !this.done });
  };

  get textDone() {
    return this.text + (this.done ? ' (done)' : '');
  }
}

export class TodoStore {
  get todoResponse() {
    return todoListQuery.result;
  }

  todoItemQueries = new Map<string, ReturnType<typeof createTodoItemQuery>>();

  getTodo(id: string) {
    if (!this.todoItemQueries.has(id)) {
      this.todoItemQueries.set(id, createTodoItemQuery(id));
    }

    const query = this.todoItemQueries.get(id) ?? createTodoItemQuery(id);

    return query.result;
  }

  constructor() {
    makeAutoObservable(this, { todoItemQueries: false }, { autoBind: true });
  }
}

export const todoStore = new TodoStore();
export const TodoStoreContext = createContext(todoStore);
export const useTodoStore = () => useContext(TodoStoreContext);
