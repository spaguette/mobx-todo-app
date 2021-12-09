import React, { FC } from "react";
import TodoItem from "../../../components/TodoItem";
import type { Todo } from "../../../models/Todo";

export type TodoListProps = {
  todoValues: readonly Todo[];
  onTodoDelete: (todoId: string) => void;
};

export const TodoList: FC<TodoListProps> = ({ todoValues, onTodoDelete }) => (
  <ul data-testid="todo-list">
    {todoValues.map((todo) => (
      <li key={todo.id}>
        <TodoItem todo={todo} onDelete={onTodoDelete} />
      </li>
    ))}
  </ul>
);
