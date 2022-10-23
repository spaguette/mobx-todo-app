import { createContext, useContext } from "react";
import {
  flow,
  observable,
  values,
  set,
  remove,
  makeAutoObservable,
} from "mobx";
import { nanoid } from "nanoid";
import { TodoAPI } from "../api/todos";
import { RequestState } from "../constants";
import { toGenerator } from "../utils/toGenerator";

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
    makeAutoObservable(this, {}, { autoBind: true });
    this.id = id;
    this.text = text;
    this.done = done;
  }

  toggle = flow(function* (this: Todo) {
    this.done = !this.done;
    try {
      yield todoApi.put(this);
    } catch (e) {
      console.error(e);
    }
  });
}

export class TodoStore {
  todos = observable.map<string, Todo>();
  state = RequestState.IDLE;
  abortController?: AbortController;

  constructor() {
    makeAutoObservable(this, { abortController: false }, { autoBind: true });
  }

  get todoValues() {
    return values(this.todos);
  }

  addTodo = flow(function* (this: TodoStore, text: string) {
    const id = nanoid();
    // Optimistically create and add a new todo
    const newTodo = new Todo({ id, text });
    set(this.todos, id, newTodo);
    try {
      const serverTodo = yield* toGenerator(todoApi.add(newTodo));

      // After the server created the new todo, exchange the optimistically created one
      // with the server Todo
      remove(this.todos, newTodo.id);
      set(this.todos, serverTodo.id, new Todo({ ...serverTodo, text }));
    } catch (e) {
      console.error(e);
    }
  });

  removeTodo = flow(function* (this: TodoStore, todoId: string) {
    remove(this.todos, todoId);
    try {
      yield todoApi.delete(todoId);
    } catch (e) {
      console.error(e);
    }
  });

  fetchTodos = flow(function* (this: TodoStore) {
    if (this.state === RequestState.LOADING) {
      return;
    }
    this.state = RequestState.LOADING;
    try {
      this.abortController = new AbortController();
      const todosArr = yield* toGenerator(
        todoApi.fetchAll(this.abortController.signal)
      );
      todosArr.forEach((todo) => set(this.todos, todo.id, new Todo(todo)));
      this.state = RequestState.SUCCESS;
    } catch (e) {
      console.error(e);
      this.state = RequestState.ERROR;
    }
  });

  cancelTodosFetch() {
    this.abortController?.abort();
    this.state = RequestState.CANCELLED;
  }
}

export const todoStore = new TodoStore();
export const TodoStoreContext = createContext(todoStore);
export const useTodoStore = () => useContext(TodoStoreContext);
