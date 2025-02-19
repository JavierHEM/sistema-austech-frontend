// src/pages/Login.jsx
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    login.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <div>
          <div className="flex flex-col items-center justify-center">
            <img
              src="/austech-logo.png"
              alt="Austech Logo"
              className="h-24 w-auto mb-6"
            />

            <p className="mt-2 text-center text-sm text-gray-400">
              Ingrese sus credenciales
            </p>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  {...register('email', { 
                    required: 'El correo es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Dirección de correo inválida'
                    }
                  })}
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  {...register('password', { 
                    required: 'La contraseña es requerida' 
                  })}
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {login.isError && (
            <div className="rounded-md bg-red-900 border border-red-700 p-4">
              <p className="text-sm text-red-300">
                Credenciales inválidas. Por favor, verifique su correo y contraseña.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={login.isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-offset-gray-900"
          >
            {login.isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </div>
            ) : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}