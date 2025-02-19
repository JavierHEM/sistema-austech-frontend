// src/lib/axios.js
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://sistema-austech-backend-l2ri.onrender.com',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Para debug
api.interceptors.request.use(request => {
  console.log('Starting Request:', request)
  return request
})

api.interceptors.response.use(
  response => {
    console.log('Response:', response)
    return response
  },
  error => {
    console.log('Response Error:', error)
    return Promise.reject(error)
  }
)