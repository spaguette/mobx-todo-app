import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useTodoStore } from '../../../models/Todo';
import TodoList from './TodoList';

const TodoListController: FC = () => {
  const store = useTodoStore();
  const { data, isLoading, isError } = store.todoResponse;

  if (isLoading) {
    return <div data-testid="loader">LOADING...</div>;
  }

  if (isError) {
    return <div data-testid="error">ERROR :(</div>;
  }

  return <TodoList todoValues={data!} />;
};

export default observer(TodoListController);
