import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // for additional matchers
import App from './App';

test('renders the App component', () => {
    render(<App />);
    // You can check for specific text, elements, or other content in your App component
    expect(screen.getByText(/Keep track of what really matters./i)).toBeDefined()
});
