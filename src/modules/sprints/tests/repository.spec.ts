import createTestDatabase from '@tests/utils/createTestDatabase'
import type { Kysely } from 'kysely'
import buildRepository from '../repository'
import { sprintMatcher, fakeSprint } from './utils'
import type { DB } from '@/database/types'

type SprintRepository = ReturnType<typeof buildRepository>

let db: Kysely<DB>
let repository: SprintRepository

beforeAll(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)
  await db.deleteFrom('sprints').execute()
})

afterEach(async () => {
  await db.deleteFrom('sprints').execute()
})

afterAll(() => db.destroy())

describe('create and select', () => {
  it('should create a sprint and get a sprint', async () => {
    const sprint = await repository.create(fakeSprint())

    expect(sprint).toEqual(sprintMatcher())

    const sprints = await repository.selectAll()
    expect(sprints).toHaveLength(1)
    expect(sprints[0]).toEqual(sprint)
  })
  it('should find a sprint by ID', async () => {
    await repository.create(fakeSprint({ id: 10 }))

    const foundSprint = await repository.selectById(10)

    expect(foundSprint).toEqual(sprintMatcher({ id: 10 }))
  })

  it('should return undefined when searching for a sprint with non existing ID', async () => {
    const foundSprint = await repository.selectById(1000)

    expect(foundSprint).toBeUndefined()
  })
})

describe('update', () => {
  it('should update the sprint', async () => {
    await repository.create(fakeSprint({ id: 10 }))

    const updatedSprint = await repository.update(10, {
      title: 'Web Dev Module 1 Sprint',
    })

    expect(updatedSprint).toEqual(
      sprintMatcher({ id: 10, title: 'Web Dev Module 1 Sprint' })
    )
  })

  it('should return undefined when updating the sprint with non existing ID', async () => {
    const updatedSprint = await repository.update(1000, {
      title: 'Web Dev Module 1 Sprint',
    })

    expect(updatedSprint).toBeUndefined()
  })
})

describe('delete', async () => {
  it('should delete the sprint', async () => {
    await repository.create(fakeSprint({ id: 10 }))

    await repository.delete(10)

    const sprints = await repository.selectAll()
    expect(sprints).toHaveLength(0)
  })

  it('should return undefined when deleting not existing sprint', async () => {
    const deletedSprint = await repository.delete(1000)

    expect(deletedSprint).toBeUndefined()
  })
})
