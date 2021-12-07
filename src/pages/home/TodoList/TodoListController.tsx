import React, { FC, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useTodoStore, Todo } from "../../../models/Todo";
import { TodoList } from "./TodoList";
import { RequestState } from "../../../constants";

const TodoListController: FC = () => {
  const store = useTodoStore();

  useEffect(() => {
    if (store.state === RequestState.IDLE) {
      store.fetchTodos();
    }
  }, [store]);

  const onTodoDelete = useCallback(
    (todo: Todo) => store.removeTodo(todo.id),
    [store]
  );

  if (store.state === RequestState.LOADING) {
    return <div data-testid="loader">LOADING...</div>;
  }

  if (store.state === RequestState.ERROR) {
    return <div data-testid="error">ERROR :(</div>;
  }

  return <TodoList onTodoDelete={onTodoDelete} todoValues={store.todoValues} />;
};

export default observer(TodoListController);
