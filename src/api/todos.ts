import * as yup from "yup";
import type { ITodoData } from "../models/Todo";

export const BASE_URL = "https://61ab99db264ec200176d4283.mockapi.io/api/v1/todos";

const handleFetchError = (res: any) => {
  if (res.status >= 300) {
    throw new Error(res.body || "Unknown error");
  }
  return res;
};

export class TodoAPI {
  static readonly Schema = yup.object({
    id: yup.string().required(),
    text: yup.string().required(),
    done: yup.bool(),
  });

  static async decodeTodo(res: unknown): Promise<ITodoData> {
    const schema = TodoAPI.Schema.required();
    return schema.validate(res);
  }

  static async decodeTodos(res: unknown): Promise<ITodoData[]> {
    const schema = yup.array(TodoAPI.Schema).required();
    return schema.validate(res);
  }

  constructor(private baseUrl = BASE_URL) {}

  async fetchAll(signal?: AbortSignal) {
    return fetch(this.baseUrl, { signal })
      .then(handleFetchError)
      .then((res) => res.json())
      .then(TodoAPI.decodeTodos);
  }

  async put(newTodo: ITodoData) {
    return fetch(`${this.baseUrl}/${newTodo.id}`, {
      method: "PUT",
      body: JSON.stringify(newTodo),
    })
      .then(handleFetchError)
      .then((res) => res.json())
      .then(TodoAPI.decodeTodo);
  }

  async delete(todoId: string) {
    return fetch(`${this.baseUrl}/${todoId}`, {
      method: "DELETE",
    })
      .then(handleFetchError)
      .then((res) => res.json())
      .then(TodoAPI.decodeTodo);
  }

  async add(todo: ITodoData) {
    return fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(todo),
    })
      .then(handleFetchError)
      .then((res) => res.json())
      .then(TodoAPI.decodeTodo);
  }
}
