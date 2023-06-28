import { FastifyInstance } from 'fastify'
import { authenticate } from '../plugins/authenticate'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function mealRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/meal',
    { onRequest: [authenticate] },
    async (request, response) => {
      const createMealBody = z.object({
        name: z.string(),
        description: z.string(),
        dateTime: z.string(),
        onDiet: z.coerce.boolean(),
      })

      const { name, description, dateTime, onDiet } = createMealBody.parse(
        request.body,
      )

      const userId = request.user.sub
      console.log(userId)

      await knex('meal').insert({
        id: randomUUID(),
        name,
        description,
        onDiet,
        dateTime,
        user: userId,
      })

      return response.status(201).send()
    },
  )
  fastify.get(
    '/meal',
    { onRequest: [authenticate] },
    async (request, response) => {
      const userId = request.user.sub

      const meals = await knex('meal').where('user', userId)

      return response.status(200).send(meals)
    },
  )
}
