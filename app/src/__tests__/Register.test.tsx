import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import useAuthContext from '../hooks/useAuthContext';
import axios from '../lib/axios.ts';
import Register from '../pages/Register';
import AuthProvider from '../providers/AuthProvider';
import GlobalProvider from '../providers/GlobalProvider';

jest.mock('../hooks/useAuthContext');
jest.mock('../lib/axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('Register Component', () => {
  const mockRegister = jest.fn();
  (useAuthContext as jest.Mock).mockReturnValue({
    register: mockRegister,
    errors: {},
    loading: false,
  });

  beforeEach(async () => {
    // resetAllMocks clears configuration (mockReturnValue) as well as call history, so use clearAllMocks instead
    jest.clearAllMocks();

    render(
      <MemoryRouter>
        <GlobalProvider>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </GlobalProvider>
      </MemoryRouter>
    );

    // Wait for initial async operations (CSRF and auth check) to complete
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/api/sanctum/csrf-cookie');
      expect(mockAxios.post).toHaveBeenCalledWith('/api/authenticated');
    });
  });

  it('renders the form correctly', () => {
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password*', { exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i, { exact: true })).toBeInTheDocument();
  });

  it('submits the form data', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/First Name/i), 'Test');
    await user.type(screen.getByLabelText(/Last Name/i), 'Test');
    await user.type(screen.getByLabelText(/Username/i), 'test@test.com');
    await user.type(screen.getByLabelText(/Email/i), 'test@test.com');
    await user.type(screen.getByLabelText('Password*', { exact: true }), 'Test1234!!');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'Test1234!!');
    await user.click(screen.getByRole('checkbox', { name: /I agree with the terms/i }));
    await user.click(screen.getByRole('button', { name: /Register/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      first_name: 'Test',
      last_name: 'Test',
      email: 'test@test.com',
      password: 'Test1234!!',
      password_confirmation: 'Test1234!!',
      username: 'test@test.com',
      terms: true,
    });
  });
});
