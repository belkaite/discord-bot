import createTestDatabase from '@tests/utils/createTestDatabase'
import type { Kysely } from 'kysely'
import buildRepository from '../repository'
import { messageMatcher, fakeMessage } from './utils'
import type { DB } from '@/database/types'


type MessagesRepository = ReturnType<typeof buildRepository>

let db: Kysely<DB>
let repository: MessagesRepository

beforeAll(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)
})

afterEach(async () => {
  await db.deleteFrom('messages').execute()
  await db.deleteFrom('users').execute()
  await db.deleteFrom('sprints').execute()
  await db.deleteFrom('templates').execute()
})

afterAll(() => db.destroy())

describe('create', () => {
  it('should create and get a message', async () => {
    await db
      .insertInto('users')
      .values({ username: 'RuSau', firstName: 'Ruta', lastName: 'Saule' })
      .execute()
    await db
      .insertInto('sprints')
      .values({ code: 'WD-1.1', title: 'Web Development Module 1 Sprint 1' })
      .execute()
    await db
      .insertInto('templates')
      .values({ content: 'Congrats on completing {sprintTitle}, {username}' })
      .execute()

    const message = await repository.create(fakeMessage())

    expect(message).toEqual(messageMatcher())

    const messages = await repository.selectAll()
    expect(messages).toHaveLength(1)
    expect(messages[0]).toEqual(message)
  })
})

describe('select', () => {
  beforeEach(async () => {
    await db
      .insertInto('users')
      .values([
        { id: 1, username: 'RuSau', firstName: 'Ruta', lastName: 'Saule' },
        { id: 2, username: 'DuKol', firstName: 'Dumas', lastName: 'Koldunas' },
      ])
      .execute()
    await db
      .insertInto('sprints')
      .values([
        { id: 1, code: 'CC-1.1', title: 'Cat m 1 sprint 1' },
        { id: 2, code: 'CC-1.2', title: 'Cat m 1 sprint 2' },
        { id: 3, code: 'CC-1.3', title: 'Cat m 1 sprint 3' },
      ])
      .execute()
    await db
      .insertInto('templates')
      .values([
        { id: 1, content: 'Congrats on completing {sprintTitle}, {username}' },
      ])
      .execute()

    await repository.create(fakeMessage({ userId: 1, sprintId: 1 }))
    await repository.create(fakeMessage({ userId: 2, sprintId: 2 }))
    await repository.create(fakeMessage({ userId: 1, sprintId: 3 }))
  })

  it('should return all messages when no filters', async () => {
    const messages = await repository.select('', '')

    expect(messages).toHaveLength(3)
  })

  it('should return messages by username', async () => {
    const messages = await repository.select('RuSau', '')

    expect(messages).toHaveLength(2)
    messages.forEach((message) => {
      expect(message.username).toBe('RuSau')
    })
  })

  it('should return messages by sprint code', async () => {
    const messages = await repository.select('', 'CC-1.1')

    expect(messages).toHaveLength(1)
    expect(messages[0].sprintCode).toBe('CC-1.1')
  })

  it('should retunr messages filtered by both - username and sprint code', async () => {
    const messages = await repository.select('RuSau', 'CC-1.1')

    expect(messages).toHaveLength(1)
    expect(messages[0].sprintCode).toBe('CC-1.1')
    expect(messages[0].username).toBe('RuSau')

  })
})
