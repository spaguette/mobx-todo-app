import React, { FC, useCallback } from "react";
import { useTodoStore } from "../../../models/Todo";
import { InputControls } from "./InputControlsView";

export const InputController: FC = () => {
  const store = useTodoStore();

  const onCreateNewTodo = useCallback(
    (text: string) => store.addTodo(text),
    [store]
  );

  return <InputControls onCreateNewTodo={onCreateNewTodo} />;
};
