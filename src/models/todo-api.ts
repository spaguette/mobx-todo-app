import { action, type IObservableArray } from 'mobx';
import { TodoAPI } from '../api/todos';
import { MobxMutation } from '../query/mobx-mutation';
import { queryClient } from '../query/mobx-query-provider';
import { MobxQuery } from '../query/query';
import { ITodoData, Todo } from './Todo';
import { update } from 'ramda';

const todoApi = new TodoAPI();

const TODO_QUERY_KEY = ['todos'];

export const todoListQuery = new MobxQuery({
  queryKey: TODO_QUERY_KEY,
  queryFn: async () => {
    const res = await todoApi.fetchAll();
    return res.map((todoData) => new Todo(todoData));
  },
});

export const createTodoItemQuery = (id: string) =>
  new MobxQuery({
    queryKey: [...TODO_QUERY_KEY, id],
    queryFn: async () => {
      const res = await todoApi.fetchOne(id);
      return new Todo(res);
    },
  });

export const deleteTodo = new MobxMutation({
  mutationFn: async (id: string) => todoApi.delete(id),
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEY });
  },
});

export const putTodo = new MobxMutation({
  mutationFn: async (payload: ITodoData) => todoApi.put(payload),
  onMutate: async (newTodo) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: TODO_QUERY_KEY });

    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData(TODO_QUERY_KEY);

    // Optimistically update to the new value
    queryClient.setQueryData(
      TODO_QUERY_KEY,
      action((old: IObservableArray<Todo>) => {
        const index = old.findIndex((t) => t.id === newTodo.id);
        return update(index, new Todo(newTodo), old);
      }),
    );

    // Return a context with the previous todos
    return { previousTodos };
  },
  // If the mutation fails, use the context we returned above
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(TODO_QUERY_KEY, context?.previousTodos);
  },
  onSuccess: (newTodo) => {
    queryClient.setQueryData(
      TODO_QUERY_KEY,
      action((old: IObservableArray<Todo>) => {
        const index = old.findIndex((t) => t.id === newTodo.id);
        return update(index, new Todo(newTodo), old);
      }),
    );
  },
});

export const createTodo = new MobxMutation({
  mutationFn: async (payload: ITodoData) => todoApi.add(payload),
  onMutate: async (newTodo) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: TODO_QUERY_KEY });

    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData(TODO_QUERY_KEY);

    // Optimistically update to the new value
    queryClient.setQueryData(TODO_QUERY_KEY, (old: IObservableArray<Todo>) => {
      return [...old, new Todo(newTodo)];
    });

    // Return a context object with the snapshotted value
    return { previousTodos };
  },
  // If the mutation fails,
  // use the context returned from onMutate to roll back
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context?.previousTodos);
  },
  // Always replace after success:
  onSuccess: (newTodo, optimisticTodo) => {
    queryClient.setQueryData(
      TODO_QUERY_KEY,
      action((old: IObservableArray<Todo>) => {
        const index = old.findIndex((t) => t.id === optimisticTodo.id);
        if (index === -1) {
          return old;
        }
        return update(index, new Todo(newTodo), old);
      }),
    );
  },
});
