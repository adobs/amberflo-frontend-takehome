import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ToastProvider } from './providers/ToastProvider';
import { Home } from './components/Home';
import { MeterDetails } from './components/MeterDetails';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: 'meter-details',
    element: <MeterDetails />,
  },
]);

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ChakraProvider>
  </React.StrictMode>
);
