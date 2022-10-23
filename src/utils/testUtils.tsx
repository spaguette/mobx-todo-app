import { FC, ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { TodoStore, TodoStoreContext } from "../models/Todo";

const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <TodoStoreContext.Provider value={new TodoStore()}>
      {children}
    </TodoStoreContext.Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
