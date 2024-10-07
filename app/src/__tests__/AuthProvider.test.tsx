import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider";
import axios from "../lib/axios"
import useAuthContext from "../hooks/useAuthContext.ts";

jest.mock('../lib/axios');

const mockAxios = axios as jest.Mocked<typeof axios>;

const registerData = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  terms: true
};

const TestComponent = () => {
  const { login, register, user } = useAuthContext();

  return (
    <>
      <button onClick={() => login({ email: 'john@example.com', password: 'password123' })}>Login</button>
      <button onClick={() => register({...registerData})}>Register</button>
      <div>{user?.email}</div>
    </>
  );
};

describe('AuthProvider', () => {
  beforeAll(() => {
    // Simulate a successful API call that returns no data.
    act(() => mockAxios.post.mockResolvedValue({}));
    // Simulates the getUser API call that returns the User's data above.
    mockAxios.get.mockResolvedValue({ data: { ...registerData } });

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it ('logs the user in successfully', async () => {
    await act(async () => {
      screen.getByText('Login').click();
    });
    // Check if the user email is displayed after logging in
    expect(await screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
