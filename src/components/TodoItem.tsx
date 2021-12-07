import React, { FC, useCallback } from "react";
import { observer } from "mobx-react-lite";
import type { Todo } from "../models/Todo";

export type TodoItemProps = {
  todo: Todo;
  onDelete: (todoId: string) => void;
};

const TodoItem: FC<TodoItemProps> = ({ todo, onDelete }) => {
  const handleDeleteClick = useCallback(() => {
    onDelete(todo.id);
  }, [onDelete, todo]);

  const handleTodoToggle = useCallback(() => {
    todo.toggle();
  }, [todo]);

  return (
    <div style={{ display: "inline" }}>
      <p>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={handleTodoToggle}
        />
        {todo.text}
        <button onClick={handleDeleteClick}>Delete</button>
      </p>
    </div>
  );
};

export default observer(TodoItem);
