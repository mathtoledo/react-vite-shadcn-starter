import { AxiosError, isAxiosError } from 'axios'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { ApiError } from '@/api/types/api-error'
import { apiAuth } from '@/lib/axios'
import { useToast } from '../../../hooks/use-toast'

/**
 * Authentication layout.
 *
 * Manages API error interception and organizes the layout for login and registration pages.
 *
 * @returns JSX.Element - The structure of the authentication layout.
 */
export function AuthLayout() {
  const { toast } = useToast()

  useEffect(() => {
    // Configuration of the interceptor to handle request errors
    const interceptor = apiAuth.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>): Promise<AxiosError> => {
        if (isAxiosError(error)) {
          // Display error message for HTTP status >= 400
          if (error.status && error.status >= 400) {
            toast({
              title: 'Error',
              description: error.response?.data.message ?? '',
              variant: 'destructive',
            })
          }
        }
        return Promise.reject(error)
      },
    )

    // Remove the interceptor when the component unmounts
    return () => {
      apiAuth.interceptors.response.eject(interceptor)
    }
  }, [toast])

  return (
    <div className='grid min-h-screen min-w-[238px] bg-[url(/images/bg-login.png)] bg-cover antialiased sm:grid-cols-2'>
      {/* Main column with authentication content */}
      <div className='flex h-full flex-col justify-between p-10 text-muted-foreground'>
        <div className='flex h-full flex-col items-center justify-center'>
          {/* Outlet to render authentication routes (e.g., login, register) */}
          <Outlet />
        </div>
      </div>

      {/* Column with background image (visible only on larger screens) */}
      <div className='hidden overflow-hidden sm:relative sm:block'>
        <div className='inset-0 bg-[url(/images/sign-in-bg.jpg)] bg-cover bg-right bg-no-repeat sm:absolute' />
      </div>
    </div>
  )
}
