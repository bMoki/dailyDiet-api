import { FastifyInstance } from 'fastify'
import { authenticate } from '../plugins/authenticate'
import { knex } from '../database'

export async function summaryRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/summary',
    { onRequest: [authenticate] },
    async (request, response) => {
      const userId = request.user.sub

      const meals = await knex('meal')
        .where('user', userId)
        .orderBy('dateTime', 'asc')

      const summary = meals.reduce(
        (summary, meal) => {
          summary.mealsAmount++

          if (meal.onDiet) {
            summary.onDietMealsAmount++
            summary.sequenceOfMealsOnDiet++
          } else {
            summary.offDietMealsAmount++
            summary.sequenceOfMealsOnDiet = 0
          }

          if (
            summary.bestSequenceOfMealsOnDiet < summary.sequenceOfMealsOnDiet
          ) {
            summary.bestSequenceOfMealsOnDiet = summary.sequenceOfMealsOnDiet
          }
          return summary
        },
        {
          mealsAmount: 0,
          offDietMealsAmount: 0,
          onDietMealsAmount: 0,
          sequenceOfMealsOnDiet: 0,
          bestSequenceOfMealsOnDiet: 0,
        },
      )
      return response.send({ summary })
    },
  )
}
