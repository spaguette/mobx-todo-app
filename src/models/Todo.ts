import { createContext, useContext } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { nanoid } from "nanoid";
import { TodoAPI } from "../api/todos";
import { RequestState } from "../constants";

const todoApi = new TodoAPI();

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
    makeAutoObservable(this);
    this.id = id;
    this.text = text;
    this.done = done;
  }

  async toggle() {
    this.done = !this.done;
    try {
      await todoApi.put(this);
    } catch (e) {
      console.error(e);
    }
  }
}

export class TodoStore {
  todos = new Map<string, Todo>();
  state = RequestState.IDLE;

  constructor() {
    makeAutoObservable(this);
  }

  get todoValues() {
    return [...this.todos.values()];
  }

  async addTodo(text: string) {
    const id = nanoid();
    // Optimistically create and add a new todo
    const newTodo = new Todo({ id, text });
    this.todos.set(id, newTodo);
    try {
      const serverTodo = await todoApi.add(newTodo);

      runInAction(() => {
        // After the server created the new todo, exchange the optimistically created one
        // with the server Todo
        this.todos.delete(newTodo.id);
        this.todos.set(serverTodo.id, new Todo({ ...serverTodo, text }));
      });
    } catch (e) {
      console.error(e);
    }
  }

  async removeTodo(todoId: string) {
    this.todos.delete(todoId);
    try {
      await todoApi.delete(todoId);
    } catch (e) {
      console.error(e);
    }
  }

  async fetchTodos() {
    this.state = RequestState.LOADING;
    try {
      const todosArr = await todoApi.fetchAll();
      runInAction(() => {
        todosArr.forEach((todo) => this.todos.set(todo.id, new Todo(todo)));
        this.state = RequestState.SUCCESS;
      });
    } catch (e) {
      console.error(e);
      runInAction(() => {
        this.state = RequestState.ERROR;
      });
    }
  }
}

export const todoStore = new TodoStore();
export const TodoStoreContext = createContext(todoStore);
export const useTodoStore = () => useContext(TodoStoreContext);
