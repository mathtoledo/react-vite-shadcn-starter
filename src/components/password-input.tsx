import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Propriedades para o componente PasswordInput.
 * Estende os atributos padrão de um input HTML.
 */
export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>

/**
 * Componente de Input para senha.
 * Permite alternar entre visualização e ocultação da senha.
 *
 * @param {PasswordInputProps} props - Propriedades do componente.
 * @returns JSX.Element - Input para senha com funcionalidade de toggle.
 */
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    // Estado para controlar a visibilidade da senha
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className={cn('relative flex items-center', className)}>
        {/* Campo de Input */}
        <input
          type={showPassword ? 'text' : 'password'} // Alterna entre texto e senha
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className, // Classes adicionais passadas como props
          )}
          ref={ref} // ForwardRef para compatibilidade
          {...props} // Spread das demais propriedades do input
        />

        {/* Ícone para alternar visibilidade */}
        <div className='absolute right-2'>
          {showPassword ? (
            <EyeOff
              className='cursor-pointer text-gray-900'
              onClick={() => setShowPassword(false)} // Oculta a senha
            />
          ) : (
            <Eye
              className='cursor-pointer text-gray-900'
              onClick={() => setShowPassword(true)} // Exibe a senha
            />
          )}
        </div>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
