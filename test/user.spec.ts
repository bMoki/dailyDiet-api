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

describe('User routes', () => {
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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/user')
      .send({
        email: 'john@gmail.com',
        password: 'johnPassword',
      })
      .expect(201)
  })
})
