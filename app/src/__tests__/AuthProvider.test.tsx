import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, AxiosHeaders } from 'axios';
import { MemoryRouter } from "react-router";

import useGlobalContext from '../hooks/useGlobalContext';
import axios from "../lib/axios";
import Login from "../pages/Login";
import AuthProvider from "../providers/AuthProvider";
import GlobalProvider from '../providers/GlobalProvider';
import type { Status } from '../types/Status';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  // Spread the actual properties and module functions into the mock`s implementation
  ...jest.requireActual('react-router'),
  // create a mock function used by the login function to navigate to the dashboard after successful login
  useNavigate: () => mockNavigate,
}));

jest.mock('../lib/axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Set up the GlobalContext
jest.mock('../hooks/useGlobalContext');
const mockSetStatus: jest.MockedFn<(status: Status) => void> = jest.fn();
const mockHandleError: jest.MockedFn<<T>(e: AxiosError, setErrorsFn?: (arg: T) => void) => void> =
  jest.fn().mockImplementation((error, setErrorsFn) => {
    if (error instanceof AxiosError && setErrorsFn) {
      setErrorsFn(error.response?.data?.errors || {errors: [error.message]});
    }
    mockSetStatus({ type: 'error', message: error.response?.data?.message || error.message });
  });
(useGlobalContext as jest.Mock).mockReturnValue({
  setStatus: mockSetStatus,
  handleError: mockHandleError
});

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs the user in successfully', async () => {
    const user = userEvent.setup();

    mockAxios.get.mockResolvedValue({}); // Mock csrf call
    mockAxios.post.mockResolvedValueOnce({ data: { user: { id: 'id-1', name: 'John Doe' } } });

    render(
      <MemoryRouter>
        <GlobalProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </GlobalProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(async () => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/login', {
        email: 'john@example.com',
        password: 'password123',
        remember: false,
      });

      // Once for the authenticated request, once for the mocked POST
      expect(mockAxios.post).toHaveBeenCalledTimes(2);

      // Await the promise and then assert the value
      const resolvedValue = await mockAxios.post.mock.results[0].value;
      expect(resolvedValue).toEqual({ data: { user: { id: 'id-1', name: 'John Doe' } }});

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockSetStatus).toHaveBeenCalledWith({ type: 'success', message: 'Successfully Logged In!' });

      // TODO: Figure out why the location is not changing
      // expect(window.location.pathname).not.toBe('/login');
      // expect(window.location.pathname).toBe('/dashboard');
      // expect(screen.getByText('Relationships')).toBeDefined();
    });
  });

  it('handles login error', async () => {
    const user = userEvent.setup();

    mockAxios.get.mockResolvedValue({}); // Mock csrf call
    mockAxios.post.mockResolvedValueOnce({ data: { user: { id: 'id-1', name: 'John Doe' } } });
    const axiosError = new AxiosError(
      'Login Failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        data: { message: 'Login Failed' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: { headers: new AxiosHeaders({ 'Content-Type': 'application/json' }) }
      }
    );
    mockAxios.post.mockRejectedValueOnce(axiosError);

    render(
      <MemoryRouter>
        <GlobalProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </GlobalProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(async () => {
      // const getResponse = await mockAxios.get.mock.results[0].value;
      const results = await mockAxios.get('/api/csrf');
      expect(results).toEqual({});
      // expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockHandleError).toHaveBeenCalledWith(axiosError, expect.any(Function)); // handleError(e, callbackFn);
      expect(mockSetStatus).toHaveBeenCalled();
      expect(mockSetStatus).toHaveBeenCalledWith({ type: 'error', message: 'Login Failed' });
    });
  });
});
