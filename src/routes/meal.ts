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
        onDiet: z.boolean(),
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
  fastify.put(
    '/meal/:id',
    { onRequest: [authenticate] },
    async (request, response) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const getMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dateTime: z.string(),
        onDiet: z.coerce.boolean(),
      })

      const { name, description, onDiet, dateTime } = getMealBodySchema.parse(
        request.body,
      )
      const { id } = getMealParamsSchema.parse(request.params)
      const userId = request.user.sub

      const meal = await knex('meal').where({ id, user: userId }).first()

      if (!meal) {
        return response.status(404).send({ message: 'Meal not found' })
      }

      await knex('meal')
        .update({
          name,
          description,
          onDiet,
          dateTime,
        })
        .where({ id, user: userId })

      return response.status(200).send()
    },
  )
  fastify.delete(
    '/meal/:id',
    { onRequest: [authenticate] },
    async (request, response) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)
      const userId = request.user.sub

      await knex('meal').delete().where({ id, user: userId })

      return response.status(200).send()
    },
  )
  fastify.get(
    '/meal/:id',
    { onRequest: [authenticate] },
    async (request, response) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)
      const userId = request.user.sub

      const meal = await knex('meal').where({ id, user: userId }).first()

      if (!meal) {
        return response.status(404).send({ message: 'Meal not found' })
      }
      return { meal }
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
