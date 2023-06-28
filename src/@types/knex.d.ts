// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    user: {
      id: string
      email: string
      password: string
      createAt: string
    }
    meal: {
      id: string
      name: string
      description: string
      dateTime: string
      onDiet: boolean
      user: string
      createdAt: string
    }
  }
}
