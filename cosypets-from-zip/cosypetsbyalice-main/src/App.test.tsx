import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Basic assertion - we expect at least something to be in the document
        // Adjust this based on your actual landing page content
        expect(document.body).toBeInTheDocument();
    });
});
