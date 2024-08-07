import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import type { Kysely } from 'kysely'
import { fakeTemplate, templateMatcher } from './utils'
import buildRepository from '../repository'
import createApp from '@/app'
import type { DB } from '@/database/types'

type TemplateRepository = ReturnType<typeof buildRepository>

let db: Kysely<DB>
let repository: TemplateRepository
let app: ReturnType<typeof createApp>

beforeAll(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)
  app = createApp(db)
  await db.deleteFrom('templates').execute()
})

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('templates').execute()
})

describe('GET', () => {
  it('should return an empty array when there are no templates', async () => {
    const { body } = await supertest(app).get('/templates').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing templates', async () => {
    await repository.create(fakeTemplate())

    const { body } = await supertest(app).get('/templates').expect(200)

    expect(body).toEqual([templateMatcher()])
  })
})

describe('GET/:id', () => {
  it('should return a template if it exists', async () => {
    await repository.create(fakeTemplate({ id: 10 }))

    const { body } = await supertest(app).get('/templates/10').expect(200)

    expect(body).toEqual(templateMatcher({ id: 10 }))
  })
})

describe('POST', () => {
  it('should return 201 and created template', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(fakeTemplate())
      .expect(201)

    expect(body).toEqual(templateMatcher())
  })
})

describe('PATCH /:id', () => {
  it('allows updates', async () => {
    await repository.create(fakeTemplate({ id: 10 }))

    const { body } = await supertest(app)
      .patch('/templates/10')
      .send({
        content: 'Congratulations, {username}, on finishing {sprintTitle}!',
      })
      .expect(200)

    expect(body).toEqual(
      templateMatcher({
        id: 10,
        content: 'Congratulations, {username}, on finishing {sprintTitle}!',
      })
    )
  })
})

describe('DELETE /:id', () => {
  it('allows delete the template', async () => {
    await repository.create(fakeTemplate({ id: 10 }))

    await supertest(app).delete('/templates/10').expect(204)

    const { body } = await supertest(app).get('/templates/10').expect(404)

    expect(body.error).toBe('Template not found')
  })
})
