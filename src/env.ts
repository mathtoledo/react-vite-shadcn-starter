import { z } from 'zod'

export const envSchema = z.object({
  VITE_API_URL: z.string().url(),
})

export const Env = envSchema.parse(import.meta.env)
