import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ProtectedRoute } from '@/components/protected-route'
import { AppLayout } from '@/lib/pages/_layouts/app'
import { AuthLayout } from '@/lib/pages/_layouts/auth'

import { Dashboard } from '@/lib/pages/app/dashboard'

import { SignIn } from '@/lib/pages/auth/sign-in'

/**
 * Application router configuration.
 *
 * The routes are divided between the authenticated layout (`AppLayout`) and the authentication layout (`AuthLayout`).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // Main application layout
    children: [
      { path: '/', element: <Navigate to='/dashboard' replace /> }, // Redirects to the dashboard
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/', // Layout for authentication
    element: <AuthLayout />,
    children: [{ path: '/sign-in', element: <SignIn /> }], // Login page
  },
])
