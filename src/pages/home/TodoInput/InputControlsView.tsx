import React, { FC, useState, useCallback } from "react";

export type InputControlsProps = {
  onCreateNewTodo: (text: string) => void;
};

export const InputControls: FC<InputControlsProps> = ({ onCreateNewTodo }) => {
  const [newTodoItemText, setNewTodoItemText] = useState("");

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodoItemText(event.target.value);
    },
    []
  );

  const handleCreateNewTodo = useCallback(() => {
    onCreateNewTodo(newTodoItemText);
    setNewTodoItemText("");
  }, [onCreateNewTodo, newTodoItemText]);

  return (
    <>
      <input value={newTodoItemText} onChange={handleInputChange} type="text" />
      <button onClick={handleCreateNewTodo}>Create a new todo item</button>
    </>
  );
};
