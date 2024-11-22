import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from '../routes.ts';

describe('App', () => {
    beforeEach(() => {
      const router = createBrowserRouter(routes);
      render(<RouterProvider router={router} />);
    });

    it('should show the welcome screen', () => {
      // Check for home page text
      expect(screen.getByText(/Keep track of what really matters./i)).toBeDefined()
    });

    it('should navigate to the login page when the login button is clicked', async () => {
        // Get the login button element
        const loginButton = screen.getAllByRole('link', { name: /log in/i })[0];

        // Simulate a click on the login button
        fireEvent.click(loginButton);

        // Check that the URL has changed to the login page
        await waitFor(() => {
          expect(window.location.pathname).not.toBe('/');
          expect(window.location.pathname).toBe('/login');
          expect(screen.getByText('Forgot your password?')).toBeDefined();
        });
    });
})
