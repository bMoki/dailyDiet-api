import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth'
import { mealRoutes } from './routes/meal'
import { userRoutes } from './routes/user'

async function bootstrap() {
  const fastify = Fastify()

  await fastify.register(cors, {
    origin: true,
  })

  // em producao isso precisa ser uma variavel de ambiente
  await fastify.register(jwt, {
    secret: 'dailyDiet',
  })

  await fastify.register(authRoutes)
  await fastify.register(mealRoutes)
  await fastify.register(userRoutes)

  await fastify.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('🚀 HTTP Server Running!')
  })
}

bootstrap()
