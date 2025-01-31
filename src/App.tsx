import './index.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { queryClient } from '@/lib/react-query'
import { router } from '@/lib/pages/routes'
import { Toaster } from './components/ui/toaster'

/**
 * Main application component.
 *
 * Configures global providers and initializes routing, theme management, and query client.
 *
 * @returns JSX.Element - Application structure.
 */
export function App() {
  return (
    <HelmetProvider>
      {/* Dynamic page title manager */}
      <Helmet titleTemplate='%s | App Name' />

      {/* Notification provider */}
      <Toaster />

      {/* Asynchronous query provider */}
      <QueryClientProvider client={queryClient}>
        {/* Routing provider */}
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  )
}
