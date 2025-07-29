import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { LinkLoadingProvider } from './Components/Context/LinkLoadProvider.tsx';
import { PageNotFound } from './Components/NotFound/index.tsx';
import { RedirectPage } from './Components/Redirect/index.tsx';
import { App } from './index.tsx';


const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <LinkLoadingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/:slug" element={<RedirectPage />} />
              <Route path="/not-found" element={<PageNotFound />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>

          <Toaster position="top-right" reverseOrder={false} />
        </LinkLoadingProvider>
      </StrictMode>
    </QueryClientProvider>
  );
} else {
  throw new Error("Root element with id 'root' not found");
}