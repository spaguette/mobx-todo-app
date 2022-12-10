import { Todo, TodoStore } from "./Todo";
import { RequestState } from "../constants";
import { vi } from 'vitest'
import { server, rest } from '../utils/server';
import { BASE_URL } from "../api/todos";

vi.mock("nanoid", () => ({
  nanoid: () => "FAKE_ID",
}));

const mockTodo = { id: "1", text: "Test 1" };

describe("TodoStore", () => {
  beforeAll(() => {
    console.error = vi.fn();
  });

  test("removes a todo", async () => {
    const store = new TodoStore();
    server.use(
      rest.delete(BASE_URL, async (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(mockTodo))
      }),
    )
    store.todos.set(mockTodo.id, new Todo(mockTodo));

    await store.removeTodo("1");
    expect(store.todos.size).toBe(0);
  });

  test("adds a todo", async () => {
    const store = new TodoStore();
    server.use(
      rest.post(BASE_URL, async (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(mockTodo))
      }),
    )

    const promise = store.addTodo(mockTodo.text).catch();
    // Sets an optimistically created Todo before making the fetch
    expect(store.todos).toMatchInlineSnapshot(`
      [
        [
          "FAKE_ID",
          Todo {
            "done": false,
            "id": "FAKE_ID",
            "text": "Test 1",
            "toggle": [Function],
          },
        ],
      ]
    `);
    await promise;
    expect(store.todos).toMatchInlineSnapshot(`
      [
        [
          "1",
          Todo {
            "done": false,
            "id": "1",
            "text": "Test 1",
            "toggle": [Function],
          },
        ],
      ]
    `);
  });

  test("fetches todos", async () => {
    const store = new TodoStore();
    server.use(
      rest.get(BASE_URL, async (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json([mockTodo]))
      }),
    )

    const promise = store.fetchTodos();
    expect(store.state).toBe(RequestState.LOADING);
    await promise;
    expect(store.todos).toMatchInlineSnapshot(`
      [
        [
          "1",
          Todo {
            "done": false,
            "id": "1",
            "text": "Test 1",
            "toggle": [Function],
          },
        ],
      ]
    `);
    expect(store.state).toBe(RequestState.SUCCESS);
  });

  test("fetches todos when API fails", async () => {
    const store = new TodoStore();
    server.use(
      rest.get(BASE_URL, async (req, res, ctx) => {
        return res.once(ctx.status(500), ctx.json("TEST ERROR FROM THE SERVER"))
      }),
    )

    const promise = store.fetchTodos();
    expect(store.state).toBe(RequestState.LOADING);
    await promise;
    expect(store.todos.size).toBe(0);
    expect(store.state).toBe(RequestState.ERROR);
  });

  test("toggles a todo", async () => {
    const store = new TodoStore();
    server.use(
      rest.put(BASE_URL, async (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(mockTodo))
      }),
    )
    store.todos.set(mockTodo.id, new Todo(mockTodo));

    await store.todos.get(mockTodo.id)?.toggle();
    expect(store.todos).toMatchInlineSnapshot(`
      [
        [
          "1",
          Todo {
            "done": true,
            "id": "1",
            "text": "Test 1",
            "toggle": [Function],
          },
        ],
      ]
    `);
  });
});
