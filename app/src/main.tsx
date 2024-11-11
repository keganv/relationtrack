import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import ErrorBoundary from './components/common/ErrorBoundary'
import AuthProvider from './providers/AuthProvider'
import GlobalProvider from './providers/GlobalProvider';

import './index.css';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <AuthProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AuthProvider>
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>
)
