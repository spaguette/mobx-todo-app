import { FC, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useTodoStore } from "../../../models/Todo";
import TodoList from "./TodoList";
import { RequestState } from "../../../constants";
import { withSafeCancel } from "../../../utils/withSafeCancel";

const TodoListController: FC = () => {
  const store = useTodoStore();
  const { state, todoValues, removeTodo, fetchTodos, cancelTodosFetch } = store;

  useEffect(() => {
    const todosFlow = withSafeCancel(fetchTodos());
    return () => {
      todosFlow.cancel();
      cancelTodosFetch();
    };
  }, [fetchTodos, cancelTodosFetch]);

  if (state === RequestState.LOADING) {
    return <div data-testid="loader">LOADING...</div>;
  }

  if (state === RequestState.ERROR) {
    return <div data-testid="error">ERROR :(</div>;
  }

  return <TodoList onTodoDelete={removeTodo} todoValues={todoValues} />;
};

export default observer(TodoListController);
