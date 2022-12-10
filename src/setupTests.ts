// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { expect, afterAll, afterEach, beforeAll } from 'vitest';
import { fetch } from 'cross-fetch';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

import { server } from './utils/server';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Add `fetch` polyfill.
global.fetch = fetch;

beforeAll(() => server.listen());
afterAll(() => {
  server.close();
  cleanup();
});
afterEach(() => server.resetHandlers());
