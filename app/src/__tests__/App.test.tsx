import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserRouter, RouterProvider } from 'react-router';

import axios from "../lib/axios";
import { routes } from '../routes.ts';

jest.mock('../lib/axios');

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('App', () => {
    beforeEach(async () => {
      // keep the axios mock implementations but clear the call tracking between tests,
      // each test should start with a clean slate
      jest.clearAllMocks();
      mockAxios.get.mockResolvedValue({ data: {} });
      mockAxios.post.mockResolvedValue({ data: { authenticated: false } });

      const router = createBrowserRouter(routes);
      render(<RouterProvider router={router} />);

      // Wait for the AuthProvider Context to be called
      // and avoid the "test was not wrapped in act(...)" errors
      await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    });

    it('should show the welcome screen', () => {
      // Check for home page text
      expect(screen.getByText(/Keep track of what really matters./i)).toBeInTheDocument()
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
        expect(screen.getByText('Forgot your password?')).toBeDefined();
      });
    });
});
