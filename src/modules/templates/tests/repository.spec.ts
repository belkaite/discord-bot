import createTestDatabase from '@tests/utils/createTestDatabase'
import type { Kysely } from 'kysely'
import buildRepository from '../repository'
import type { DB } from '@/database/types'
import { fakeTemplate, templateMatcher } from './utils'

type TemplateRepository = ReturnType<typeof buildRepository>

let db: Kysely<DB>
let repository: TemplateRepository

beforeAll(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)
})

afterEach(async () => {
  await db.deleteFrom('templates').execute()
})

afterAll(() => db.destroy())

describe('create and select', () => {
  it('should create a template and get a template', async () => {
    const template = await repository.create(fakeTemplate())

    expect(template).toEqual(templateMatcher())

    const templates = await repository.selectAll()
    expect(templates).toHaveLength(1)
    expect(templates[0]).toEqual(template)
  })

  it('should select the template by the id', async () => {
    await repository.create(fakeTemplate({ id: 10 }))

    const foundTemplate = await repository.selectByID(10)

    expect(foundTemplate).toEqual(templateMatcher({ id: 10 }))
  })

  it('should return undefined when searching for a templare with non existing ID', async () => {
    const notFoundTemplate = await repository.selectByID(1000)

    expect(notFoundTemplate).toBeUndefined()
  })
})
