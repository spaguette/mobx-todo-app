import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import React from 'react';
import TodoItem from '../../../components/TodoItem';
import type { Todo } from '../../../models/Todo';

export type TodoListProps = {
  todoValues: Todo[];
};

const TodoList: FC<TodoListProps> = ({ todoValues }) => (
  <ul data-testid="todo-list">
    {todoValues.map((todo) => (
      <li key={todo.id}>
        <TodoItem todo={todo} />
      </li>
    ))}
  </ul>
);

export default observer(TodoList);
