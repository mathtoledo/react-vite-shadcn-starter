import axios from 'axios'

import { Env } from '@/env'

export const apiAuth = axios.create({
  baseURL: Env.VITE_API_URL,
})

export const api = axios.create({
  baseURL: Env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})
