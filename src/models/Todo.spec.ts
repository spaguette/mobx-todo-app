import { Todo, TodoStore } from "./Todo";
import fetchMock from "jest-fetch-mock";
import { RequestState } from "../constants";

fetchMock.enableMocks();
jest.mock("nanoid", () => ({
  nanoid: () => "FAKE_ID",
}));

const mockTodo = { id: "1", text: "Test 1" };

describe("TodoStore", () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test("removes a todo", async () => {
    const store = new TodoStore();
    fetchMock.mockResponseOnce(JSON.stringify(mockTodo));
    store.todos.set(mockTodo.id, new Todo(mockTodo));

    await store.removeTodo("1");
    expect(store.todos.size).toBe(0);
  });

  test("adds a todo", async () => {
    const store = new TodoStore();
    fetchMock.mockResponseOnce(JSON.stringify(mockTodo));

    const promise = store.addTodo(mockTodo.text).catch();
    // Sets an optimistically created Todo before making the fetch
    expect(store.todos).toMatchInlineSnapshot(`
      Array [
        Array [
          "FAKE_ID",
          Todo {
            "done": false,
            "id": "FAKE_ID",
            "text": "Test 1",
          },
        ],
      ]
    `);
    await promise;
    expect(store.todos).toMatchInlineSnapshot(`
      Array [
        Array [
          "1",
          Todo {
            "done": false,
            "id": "1",
            "text": "Test 1",
          },
        ],
      ]
    `);
  });

  test("fetches todos", async () => {
    const store = new TodoStore();
    fetchMock.mockResponseOnce(JSON.stringify([mockTodo]));

    const promise = store.fetchTodos();
    expect(store.state).toBe(RequestState.LOADING);
    await promise;
    expect(store.todos).toMatchInlineSnapshot(`
      Array [
        Array [
          "1",
          Todo {
            "done": false,
            "id": "1",
            "text": "Test 1",
          },
        ],
      ]
    `);
    expect(store.state).toBe(RequestState.SUCCESS);
  });

  test("fetches todos when API fails", async () => {
    const store = new TodoStore();
    fetchMock.mockResponseOnce(JSON.stringify("TEST ERROR FROM THE SERVER"), {
      status: 500,
    });

    const promise = store.fetchTodos();
    expect(store.state).toBe(RequestState.LOADING);
    await promise;
    expect(store.todos.size).toBe(0);
    expect(store.state).toBe(RequestState.ERROR);
  });

  test("toggles a todo", async () => {
    const store = new TodoStore();
    fetchMock.mockResponseOnce(JSON.stringify(mockTodo));
    store.todos.set(mockTodo.id, new Todo(mockTodo));

    await store.todos.get(mockTodo.id)?.toggle();
    expect(store.todos).toMatchInlineSnapshot(`
      Array [
        Array [
          "1",
          Todo {
            "done": true,
            "id": "1",
            "text": "Test 1",
          },
        ],
      ]
    `);
  });
});
