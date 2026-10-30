import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import { Toaster } from 'sonner';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          richColors
          closeButton
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);