// import { apiAuth } from '@/lib/axios'
import { User } from '@/models/user'

/**
 * Interface for the login request body.
 */
export interface SignInBody {
  email: string // User's email
  password: string // User's password
}

/**
 * Interface for the authentication API response.
 */
interface AuthenticateApiResponse {
  user: User // Authenticated user's information
  backendTokens: {
    accessToken: string // Access token for authorization
    refreshToken: string // Refresh token to renew access
  }
}

/**
 * Function to authenticate a user.
 *
 * @param {SignInBody} data - Object containing the user's email and password.
 * @returns {Promise<AuthenticateApiResponse>} - API response with user data and tokens.
 *
 * @example
 * const { user, backendTokens } = await signIn({ email: 'teste@teste.com', password: '123456' })
 * console.log(user, backendTokens.accessToken)
 */
export async function signIn(
  data: SignInBody,
): Promise<AuthenticateApiResponse> {
  // Destructuring the request body data
  const { email, password } = data
  console.log('🚀 ~ email, password:', email, password)

  // Call to the authentication API
  // Making a POST request to the authentication API with the user's email and password
  // const response = await apiAuth.post<AuthenticateApiResponse>(
  //   '/auth/login', // Login endpoint
  //   {
  //     email,
  //     password,
  //   },
  //   {
  //     headers: {
  //       app: 'orgavet-front-admin',
  //     },
  //   },
  // )

  // Returning a fake success response for testing purposes
  const response = {
    data: {
      user: {
        id: '123',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        role: 'admin',
      },
      backendTokens: {
        accessToken: 'fakeAccessToken123',
        refreshToken: 'fakeRefreshToken123',
      },
    },
  }

  // Extracting data from the response
  const { backendTokens, user } = response.data

  // Returning user data and tokens
  return { backendTokens, user }
}
