import { render, screen } from '../../../utils/testUtils';
import { TodoListController } from '.';
import React from 'react';
import { vi } from 'vitest';
import { server, rest } from '../../../utils/server';
import { BASE_URL } from '../../../api/todos';

const mockTodo = { id: '1', text: 'Test 1' };

describe('pages/home/TodoList/TodoListController', () => {
  beforeAll(() => {
    console.error = vi.fn();
  });

  test('renders loader when fetching has started', async () => {
    server.use(
      rest.get(BASE_URL, async (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json([mockTodo]))
      }),
    )
    render(<TodoListController />);
    expect(screen.getByTestId('loader')).toBeTruthy();
  });

  test('renders error when fetching fails', async () => {
    server.use(
      rest.get(BASE_URL, async (req, res, ctx) => {
        return res.once(ctx.status(500), ctx.json({message: "test error" }))
      }),
    )

    render(<TodoListController />);
    await screen.findByTestId('error');
  });

  test('renders TodoList when fetching succeeds', async () => {
    server.use(
      rest.get(BASE_URL, async (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json([mockTodo]))
      }),
    )

    render(<TodoListController />);
    await screen.findByTestId('todo-list');
  });
});
