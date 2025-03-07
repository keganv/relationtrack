import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import useAuthContext from '../hooks/useAuthContext';
import Register from '../pages/Register';
import AuthProvider from '../providers/AuthProvider';

// Mock the Spinner component and useAuthContext hook
jest.mock('../hooks/useAuthContext');

describe('Register Component', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    (useAuthContext as jest.Mock).mockReturnValue({
      register: mockRegister,
      errors: {},
      loading: false,
    });
    render(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  it('renders the form correctly', () => {
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password*', { exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i, { exact: true })).toBeInTheDocument();
  });

  it('submits the form data', () => {
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password*', { exact: true }), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /I agree with the terms/i }));
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      username: 'johndoe',
      terms: true,
    });
  });
});
