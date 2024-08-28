import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import type { Todo } from '../models/Todo';
import { deleteTodo } from '../models/todo-api';

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
