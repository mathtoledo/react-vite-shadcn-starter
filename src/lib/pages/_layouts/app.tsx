import { AxiosError, isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { ApiError } from '@/api/types/api-error'
import { Toaster } from '@/components/ui/toaster'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/store/auth-store'
import { useToast } from '../../../hooks/use-toast'
import { SidebarProvider, SidebarTrigger } from '../../../components/ui/sidebar'
import { AppSidebar } from '../../../components/app-sidebar'

/**
 * Componente de layout principal da aplicação.
 *
 * Este componente gerencia:
 * - A autenticação do usuário.
 * - Interceptação de erros provenientes da API.
 * - Estrutura de navegação com uma barra lateral e um outlet para rotas aninhadas.
 *
 * @returns JSX.Element - Estrutura do layout com sidebar e outlet.
 */
export function AppLayout() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [isInterceptorReady, setIsInterceptorReady] = useState(false)

  // Obtém o usuário autenticado e a função de logout do store de autenticação
  const { user, backendTokens, logout } = useAuthStore()

  useEffect(() => {
    /**
     * Verifica a autenticação do usuário.
     * - Se o usuário não estiver autenticado, realiza logout e redireciona para a página de login.
     */

    if (!backendTokens?.accessToken) {
      logout()
      navigate('/sign-in', { replace: true })
    }

    const interceptorRequest = api.interceptors.request.use((config) => {
      // Adiciona o token de autenticação ao cabeçalho da requisição
      config.headers.Authorization = `Bearer ${backendTokens?.accessToken}`
      return config
    })

    /**
     * Configura um interceptor para respostas da API.
     * - Lida com erros como 401 (não autorizado) e outros códigos de erro.
     */
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>): Promise<AxiosError> => {
        if (isAxiosError(error)) {
          if (error.status) {
            if (error.status === 401) {
              // Usuário não autorizado, realiza logout e redireciona
              logout()
              navigate('/sign-in', { replace: true })
            } else if (error.status >= 400) {
              // Exibe uma mensagem de erro para status HTTP 400 ou superior
              toast({
                title: 'Error',
                description: error.response?.data.message ?? '',
                variant: 'destructive',
              })
            }
          }
        }
        return Promise.reject(error)
      },
    )

    setIsInterceptorReady(true)

    /**
     * Cleanup:
     * Remove o interceptor quando o componente for desmontado para evitar memória residual.
     */
    return () => {
      api.interceptors.response.eject(interceptor)
      api.interceptors.response.eject(interceptorRequest)
    }
  }, [backendTokens?.accessToken, logout, navigate, toast, user])

  useEffect(() => {
    /**
     * Corrige um problema de estilo causado por bibliotecas externas.
     * - Remove o atributo `pointer-events: none` do `body` quando ele é adicionado.
     * - Isso evita que cliques fiquem desativados em todo o site após eventos específicos.
     */
    const observer = new MutationObserver(() => {
      if (document.body.style.pointerEvents === 'none') {
        document.body.style.pointerEvents = 'auto'
      }
    })

    // Monitora mudanças no estilo do elemento <body>
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    })

    // Cleanup:
    // Remove o observer quando o componente for desmontado.
    return () => observer.disconnect()
  }, [])

  if (!isInterceptorReady) {
    return
  }
  return (
    <SidebarProvider>
      {/* Barra lateral fixa da aplicação */}
      <AppSidebar />
      <main className='w-full overflow-x-hidden'>
        {/* Botão para abrir/fechar a barra lateral */}
        <SidebarTrigger />
        {/* Outlet para renderizar rotas aninhadas */}
        <Outlet />
        <Toaster />
      </main>
    </SidebarProvider>
  )
}
