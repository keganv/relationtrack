import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom'; // for DOM matchers
import { routes } from '../routes.ts';

describe('App', () => {
    beforeEach(() => {
      fetchMock.enableMocks();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/'],
        future: { v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_partialHydration: true, v7_normalizeFormMethod: true, v7_skipActionErrorRevalidation: true }
      });

      render(<RouterProvider router={router} future={{ v7_startTransition: true }} />);
    });

    it('should show the welcome screen', async () => {
        // Check for home page text
        await waitFor(() => expect(screen.getByText(/Keep track of what really matters./i)).toBeDefined())
    });

    it('should navigate to the login page when the login button is clicked', () => {
        // Get the login button element
        const loginButton = screen.getAllByRole('link', { name: /log in/i })[0];

        // Simulate a click on the login button
        fireEvent.click(loginButton);

        // Check that the URL has changed to the login page
        expect(window.location.pathname).toBe('/login');
      });
})
