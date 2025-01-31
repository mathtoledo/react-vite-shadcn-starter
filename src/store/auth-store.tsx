import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { User } from '@/models/user'

/**
 * Properties used in the authentication process.
 */
type AuthenticateProps = {
  accessToken: string // Access token
  refreshToken: string // Refresh token
  user: User // Authenticated user information
}

/**
 * Interface for the authentication store state.
 */
interface AuthStore {
  user: User | null // Authenticated user data or null if not authenticated
  backendTokens: { accessToken: string; refreshToken: string } | null // Authenticated user data or null if not authenticated
  login: ({ user }: AuthenticateProps) => void // Function to perform login
  logout: () => void // Function to perform logout
  updateUser: (data: Partial<User>) => void // Function to update user information
}

/**
 * Hook `useAuthStore` - Manages the authentication state.
 *
 * Includes persistence in localStorage and support for development tools (devtools).
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        backendTokens: null,

        // Sets the user state upon login
        login: ({ user, accessToken, refreshToken }) => {
          set({ user }) // Updates the state with user information
          set({ backendTokens: { accessToken, refreshToken } })
        },

        // Resets the state upon logout
        logout: () => {
          set({ user: null }) // Removes user information
          set({ backendTokens: null })
        },

        // Updates specific user information
        updateUser: (data) => {
          set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
          })) // Updates only the provided fields
        },
      }),
      {
        name: 'authStore', // Name used to save in localStorage
      },
    ),
  ),
)

export function useAuth() {
  const { user, login, logout, updateUser } = useAuthStore()
  const isAuthenticated = !!user

  return { user, isAuthenticated, login, logout, updateUser }
}
