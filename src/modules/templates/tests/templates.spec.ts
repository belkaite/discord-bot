import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import type { Kysely } from 'kysely'
import { fakeTemplate, templateMatcher } from './utils';
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