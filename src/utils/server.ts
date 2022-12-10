// this is put into here so I can share these same handlers between my tests
// as well as my development in the browser. Pretty sweet!
import { rest } from 'msw'; // msw supports graphql too!
import { setupServer } from 'msw/node';

export const handlers = [
  //TODO: Define endpoints here
];

export const server = setupServer(...handlers);
export {rest}
