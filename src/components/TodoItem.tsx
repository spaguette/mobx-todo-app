import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import type { ITodoData, Todo } from '../models/Todo';
import { putTodo, deleteTodo } from '../models/todo-api';
import { action, toJS } from 'mobx';

export type TodoItemProps = {
  todo: Todo;
};

const TodoItem: FC<TodoItemProps> = ({ todo }) => {
  const { id } = todo;

  const handleDeleteClick = useCallback(() => {
    deleteTodo.mutate(id);
  }, [id]);

  return (
    <div style={{ display: 'inline' }}>
      <p>
        <input type="checkbox" checked={todo.done} onChange={todo.toggle} />
        {todo.textDone}
        <button onClick={handleDeleteClick}>Delete</button>
      </p>
    </div>
  );
};

export default observer(TodoItem);
