import {
  describe,
  beforeAll,
  afterAll,
  it,
  beforeEach,
  afterEach,
} from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Meal routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:latest')
  })

  afterEach(() => {
    execSync('npm run knex migrate:rollback --all')
  })

  it('should be able to create a new meal', async () => {
    await request(app.server).post('/user').send({
      email: 'john@gmail.com',
      password: 'johnPassword',
    })

    const res = await request(app.server).post('/login').send({
      email: 'john@gmail.com',
      password: 'johnPassword',
    })

    const token = res.body.token

    await request(app.server)
      .post('/meal')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'banana',
        description: 'banana caturra',
        dateTime: '2020-01-01T15:22:00Z',
        onDiet: true,
      })
      .expect(201)
  })
})
