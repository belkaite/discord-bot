import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import type { Kysely } from 'kysely'
import { omit } from 'lodash'
import { fakeUser, userMatcher } from './utils'
import buildRepository from '../repository'
import createApp from '@/app'
import type { DB } from '@/database/types'

type UserRepository = ReturnType<typeof buildRepository>

let db: Kysely<DB>
let repository: UserRepository
let app: ReturnType<typeof createApp>

beforeAll(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)
  app = createApp(db)
  await db.deleteFrom('users').execute()
})

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('users').execute()
})

describe('GET', () => {
  it('should return the all users', async () => {
    await repository.create(fakeUser())

    const { body } = await supertest(app).get('/users').expect(200)

    expect(body).toEqual([userMatcher()])
  })

  it('should return empty list if there are no users', async () => {
    const { body } = await supertest(app).get('/users').expect(200)

    expect(body).toEqual([])
  })
})

describe('GET /:username', () => {
  it('should return the user if it exists', async () => {
    await repository.create(fakeUser({ username: 'RuSau' }))

    const { body } = await supertest(app).get('/users/RuSau').expect(200)

    expect(body).toEqual(userMatcher({ username: 'RuSau' }))
  })

  it('should return 404 if username does not exist', async () => {
    const { body } = await supertest(app).get('/users/Beyonce').expect(404)
    expect(body.error).toMatch(/not found/i)
  })
})

describe('POST', () => {
  it('should return 201 and created user', async () => {
    const { body } = await supertest(app)
      .post('/users')
      .send(fakeUser())
      .expect(201)

    expect(body).toEqual(userMatcher())
  })

  it('should return 400 if username is missing', async () => {
    const { body } = await supertest(app)
      .post('/users')
      .send(omit(fakeUser(), ['username']))
      .expect(400)

    expect(body.error.message).toMatch(/username/i)
  })
})

describe('PATCH', () => {
  it('does not support patching', async () => {
    await supertest(app).patch('/users/1').expect(405)

    await supertest(app).patch('/users/RuSau').expect(405)
  })
})

describe('DELETE', () => {
  it('does not support deleting', async () => {
    await supertest(app).delete('/users/1').expect(405)

    await supertest(app).delete('/users/RuSau').expect(405)
  })
})
