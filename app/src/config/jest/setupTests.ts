// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like: expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import fetchMock from 'jest-fetch-mock';
import { TextEncoder } from 'node:util';

import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;
fetchMock.enableMocks();
