import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import type { Kysely } from 'kysely'
import { fakeSprint, sprintMatcher } from './utils'
import buildRepository from '../repository'
import createApp from '@/app'
import type { DB } from '@/database/types'

type SprintRepository = ReturnType<typeof buildRepository>

let db: Kysely<DB>
let repository: SprintRepository
let app: ReturnType<typeof createApp>

beforeAll(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)
  app = createApp(db)
})

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('sprints').execute()
})

describe('GET', () => {
  it('should return an empty array when there are no sprints', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing sprints', async () => {
    await repository.create(fakeSprint({}))

    const { body } = await supertest(app).get('/sprints').expect(200)

    expect(body).toEqual([sprintMatcher({})])
  })
})
