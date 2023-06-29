import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth'
import { mealRoutes } from './routes/meal'
import { userRoutes } from './routes/user'
import { summaryRoutes } from './routes/summary'
import { env } from './env'

async function bootstrap() {
  const fastify = Fastify()

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
  })

  await fastify.register(authRoutes)
  await fastify.register(mealRoutes)
  await fastify.register(userRoutes)
  await fastify.register(summaryRoutes)

  await fastify.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('🚀 HTTP Server Running!')
  })
}

bootstrap()
