import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../plugins/authenticate'
import { knex } from '../database'
import { compare } from 'bcryptjs'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, response) => {
    const createUserBody = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = createUserBody.parse(request.body)

    const user = await knex('user').where('email', email).first()

    if (!user) {
      return response.status(400).send({ message: 'Credentials error' })
    }

    const passwordMatches = await compare(password, user.password)

    if (!passwordMatches) {
      return response.status(400).send({ message: 'Credentials error' })
    }

    const token = await response.jwtSign(
      {
        email: user.email,
      },
      {
        sub: user.id,
        expiresIn: '1 day',
      },
    )
    return response.status(200).send({
      token,
    })
  })

  fastify.get(
    '/me',
    {
      onRequest: [authenticate],
    },
    async (request) => {
      return { user: request.user.sub }
    },
  )
}
