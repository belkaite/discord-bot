import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import type { Kysely } from 'kysely'
import buildRepository from '../repository'
import createApp from '@/app'
import type { DB } from '@/database/types'

type MessagesRepository = ReturnType<typeof buildRepository>

let db: Kysely<DB>
let repository: MessagesRepository
let app: ReturnType<typeof createApp>

beforeAll(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)
  app = createApp(db)
  await db.deleteFrom('sprints').execute()
  await db.deleteFrom('users').execute()
  await db.deleteFrom('templates').execute()
})

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('messages').execute()
  await db.deleteFrom('sprints').execute()
  await db.deleteFrom('users').execute()
  await db.deleteFrom('templates').execute()
})

describe('POST', () => {
  it('should return 200 and create a message', async () => {
    await db
      .insertInto('users')
      .values({
        username: 'RuSau',
        firstName: 'Ruta',
        lastName: 'Saule',
      })
      .execute()
    await db
      .insertInto('sprints')
      .values({ code: 'CC-1.1', title: 'Cat m 1 sprint 1' })
      .execute()
    await db
      .insertInto('templates')
      .values({
        content: 'Congrats on completing {sprintTitle}, {username}!',
      })
      .execute()

    const res = await supertest(app).post('/messages').send({
      username: 'RuSau',
      sprintCode: 'CC-1.1',
    })

    expect(res.status).toBe(200)
    expect(res.text).toMatch(/success/i)
  })
})
