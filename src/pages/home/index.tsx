import React, { FC } from "react";
import { TodoListController } from "./TodoList";
import { InputController } from "./TodoInput";

export const HomePage: FC = () => (
  <>
    <TodoListController />
    <InputController />
  </>
);
