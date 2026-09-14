import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/i18n';
import App from './App';
import '@/styles/globals.css';

const rootElement = document.getElementById('root');
document.getElementById('seo-static')?.remove();

if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
