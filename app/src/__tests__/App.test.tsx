import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom'; // for additional matchers
import App from '../App';

describe('App', () => {
    beforeEach(() => {
        render(
          <Router>
            <App />
          </Router>
        );
      });

    it('should show the welcome screen', async () => {
        // You can check for specific text, elements, or other content in your App component
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