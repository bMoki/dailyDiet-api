import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { hash } from 'bcryptjs'

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/user', async (request, response) => {
    const createUserBody = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = createUserBody.parse(request.body)

    const user = await knex('user').where('email', email).first()

    if (user) {
      return response.status(400).send({ message: 'User already exists.' })
    }

    const passwordHash = await hash(password, 3)

    await knex('user').insert({
      id: randomUUID(),
      email,
      password: passwordHash,
    })

    return response.status(201).send()
  })
}
