// src/hooks/useAuth.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/auth/profile')
        return data
      } catch (error) {
        console.error('Error fetching user profile:', error)
        localStorage.removeItem('token')
        return null
      }
    },
    retry: false,
    enabled: !!localStorage.getItem('token')
  })

  const login = useMutation({
    mutationFn: async (credentials) => {
      try {
        const { data } = await api.post('/api/auth/login', credentials)
        return data
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['user'], data)
      navigate('/')
    },
    onError: (error) => {
      console.error('Login mutation error:', error)
    }
  })

  const logout = () => {
    localStorage.removeItem('token')
    queryClient.setQueryData(['user'], null)
    navigate('/login')
  }

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}