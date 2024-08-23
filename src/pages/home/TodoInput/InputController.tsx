import { observer } from 'mobx-react-lite';
import { FC, useCallback } from 'react';
import React from 'react';
import { useTodoStore } from '../../../models/Todo';
import { InputControls } from './InputControlsView';
import { createTodo } from '../../../models/todo-api';
import { nanoid } from 'nanoid';

const InputController: FC = () => {
  const onCreateNewTodo = useCallback((text: string) => createTodo.mutate({ id: nanoid(), done: false, text }), []);

  return <InputControls onCreateNewTodo={onCreateNewTodo} />;
};

export default observer(InputController);
