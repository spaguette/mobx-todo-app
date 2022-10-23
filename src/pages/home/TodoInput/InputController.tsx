import { observer } from "mobx-react-lite";
import { FC, useCallback } from "react";
import { useTodoStore } from "../../../models/Todo";
import { InputControls } from "./InputControlsView";

const InputController: FC = () => {
  const store = useTodoStore();
  const { addTodo } = store;

  const onCreateNewTodo = useCallback(
    (text: string) => addTodo(text),
    [addTodo]
  );

  return <InputControls onCreateNewTodo={onCreateNewTodo} />;
};

export default observer(InputController);
