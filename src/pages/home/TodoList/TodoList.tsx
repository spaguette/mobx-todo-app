import { observer } from "mobx-react-lite";
import { FC } from "react";
import TodoItem from "../../../components/TodoItem";
import type { Todo } from "../../../models/Todo";

export type TodoListProps = {
  todoValues: readonly Todo[];
  onTodoDelete: (todoId: string) => void;
};

const TodoList: FC<TodoListProps> = ({ todoValues, onTodoDelete }) => (
  <ul data-testid="todo-list">
    {todoValues.map((todo) => (
      <li key={todo.id}>
        <TodoItem todo={todo} onDelete={onTodoDelete} />
      </li>
    ))}
  </ul>
);

export default observer(TodoList);
