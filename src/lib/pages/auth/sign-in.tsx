import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { useAuth } from '@/store/auth-store'
import { signIn } from '../../../api/auth/sign-in'

import reactLogo from '@/assets/react.svg'

const signInFormSchema = z.object({
  email: z.string().email({ message: 'Informe seu e-mail.' }),
  password: z.string().min(6, { message: 'Informe sua senha.' }),
})

type SignInForm = z.infer<typeof signInFormSchema>

export function SignIn() {
  const navigate = useNavigate()

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  const { login } = useAuth()

  async function handleSignIn(data: SignInForm) {
    const { email, password } = data
    const { backendTokens, user } = await authenticate({
      email,
      password,
    })

    login({
      user,
      accessToken: backendTokens.accessToken,
      refreshToken: backendTokens.refreshToken,
    })

    navigate('/dashboard', { replace: true })
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('hasRefreshed')
    if (!hasRefreshed) {
      sessionStorage.setItem('hasRefreshed', 'true')
      handleRefresh()
    }
  }, [])

  return (
    <div className='w-full md:w-96'>
      <Helmet title='Sign In' />
      <div className='p-0'>
        <div className='flex flex-col justify-center gap-1 md:gap-6'>
          <div className='flex items-center justify-center mb-4'>
            <img src={reactLogo} alt='Logo' className='w-20 mr-4' />
            <h1 className='text-3xl font-bold text-gray-900'>App Name</h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignIn)}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs text-gray-900'>
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='email'
                          placeholder='youremail@email.com'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-2'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs text-gray-900'>
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder='********'
                          autoComplete='current-password'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex w-full justify-center'>
                <Button type='button' variant='link'>
                  <Link
                    to='/reset-password/email'
                    className='py-1 font-semibold text-main-700'
                  >
                    Forgot your password?
                  </Link>
                </Button>
              </div>

              <Button
                disabled={form.formState.isSubmitting}
                type='submit'
                className='w-full'
                size='lg'
              >
                Sign In
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
