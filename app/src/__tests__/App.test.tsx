import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserRouter, RouterProvider } from 'react-router';

import axios from '../lib/axios';
import { routes } from '../routes.ts';

jest.mock('../lib/axios');

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('Home page', () => {
    beforeEach(async () => {
      // keep the axios mock implementations but clear the call tracking between tests,
      // each test should start with a clean slate
      jest.clearAllMocks();

      const router = createBrowserRouter(routes);
      render(<RouterProvider router={router} />);

      // Wait for the AuthProvider Context to be called and avoid the "test was not wrapped in act(...)" errors
      // The waitFor waits for a condition to be met.
      // expect(mockAxios.get).toHaveBeenCalled() checks if the axios.get method has been called.
      // By using await waitFor(...), the test waits until the axios.get call is completed before proceeding.
      // This ensures that the component's state is fully updated and stable before any assertions are made in the tests.
      // AuthLayout calls a post to /api/authenticated in the AuthProvider automatically which updates the state.
      await waitFor(() => expect(mockAxios.post).toHaveBeenCalled());
    });

    it('should show the welcome screen', async () => {
      // Check for home page text
      expect(await screen.findByText(/keep track of what really matters/i)).toBeInTheDocument();

      // CSRF Request
      expect(mockAxios.get).toHaveBeenCalledTimes(1);

      // Authenticated Request
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith('/api/authenticated');
    });

    it('should navigate to the login page when the login button is clicked', async () => {
      // Get the login button element
      const loginButton = screen.getAllByRole('link', { name: /log in/i })[0];

      // Simulate a click on the login button
      userEvent.click(loginButton);

      // Check that the URL has changed to the login page
      await waitFor(() => {
        expect(window.location.pathname).not.toBe('/');
        expect(window.location.pathname).toBe('/login');
        expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
      });
    });

    // This test starts on login page from the test above.
    it('should navigate to the register page', async () => {
      // Get the sign up button element
      const registerButton = screen.getAllByRole('link', { name: /sign up/i })[0];

      userEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /first name/i})).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /username/i})).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /email/i})).toBeInTheDocument();
        expect(screen.getByLabelText(/^password/i, { selector: 'input' })).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i, { selector: 'input' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: /terms/i})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i})).toBeInTheDocument();
      });
    });
});
