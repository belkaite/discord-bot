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

describe('GET /:id', () => {
  it('should return the sprint if it exists', async () => {
    await repository.create(fakeSprint({ id: 10 }))

    const { body } = await supertest(app).get('/sprints/10').expect(200)

    expect(body).toEqual(sprintMatcher({ id: 10 }))
  })
})

describe('POST', () => {
  it('should return 201 and created sprint', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint({}))
      .expect(201)

    expect(body).toEqual(sprintMatcher({}))
  })
})

describe('PATCH /:id', () => {
  it('allows updates', async () => {
    await repository.create(fakeSprint({ id: 10 }))

    const { body } = await supertest(app)
      .patch('/sprints/10')
      .send({ title: 'Web dev full course' })
      .expect(200)

    expect(body).toEqual(
      sprintMatcher({ id: 10, title: 'Web dev full course' })
    )
  })

  describe('DELETE /:id', () => {
    it('allows delete the sprint', async () => {
      await repository.create(fakeSprint({ id: 10 }))

      await supertest(app).delete('/sprints/10').expect(204)

      const { body } = await supertest(app).get('/sprints/10').expect(404)

      expect(body.error).toBe('Sprint not found')
    })
  })
})
