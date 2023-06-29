import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { env } from './env'
import { authRoutes } from './routes/auth'
import { mealRoutes } from './routes/meal'
import { userRoutes } from './routes/user'
import { summaryRoutes } from './routes/summary'

export const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: env.JWT_SECRET,
})

app.register(authRoutes)
app.register(mealRoutes)
app.register(userRoutes)
app.register(summaryRoutes)
