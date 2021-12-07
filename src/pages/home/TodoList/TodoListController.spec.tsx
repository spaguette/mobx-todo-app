import fetchMock from "jest-fetch-mock";
import { render, screen, waitFor } from "../../../utils/testUtils";
import { TodoListController } from ".";

fetchMock.enableMocks();

const mockTodo = { id: "1", text: "Test 1" };

describe("pages/home/TodoList/TodoListController", () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test("renders loader when fetching has started", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([mockTodo]));
    render(<TodoListController />);
    expect(screen.queryByTestId("loader")).toBeTruthy();
  });

  test("renders error when fetching fails", async () => {
    fetchMock.mockResponseOnce(JSON.stringify("test error"), { status: 500 });

    render(<TodoListController />);
    await waitFor(() =>
      expect(screen.getByTestId("error")).toBeInTheDocument()
    );
  });

  test("renders TodoList when fetching succeeds", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([mockTodo]));

    const wrapper = render(<TodoListController />);
    await waitFor(() =>
      expect(wrapper.getByTestId("todo-list")).toBeInTheDocument()
    );
  });
});
