import { createContext, useContext } from 'react';
import { makeAutoObservable, toJS } from 'mobx';
import { putTodo, todoListQuery } from './todo-api';

export interface ITodoData {
  id: string;
  text: string;
  done?: boolean;
}

export class Todo implements ITodoData {
  id: string;
  text: string;
  done?: boolean;

  constructor({ id, text, done = false }: ITodoData) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.id = id;
    this.text = text;
    this.done = done;
  }

  toggle() {
    putTodo.mutate({ ...toJS(this), done: !this.done });
  }

  get textDone() {
    return this.text + (this.done ? ' (done)' : '');
  }
}

export class TodoStore {
  get todoResponse() {
    return todoListQuery.query();
  }

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }
}

export const todoStore = new TodoStore();
export const TodoStoreContext = createContext(todoStore);
export const useTodoStore = () => useContext(TodoStoreContext);
