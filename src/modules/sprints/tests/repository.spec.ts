import createTestDatabase from '@tests/utils/createTestDatabase'
import buildRepository from '../repository'

let db
let repository

beforeAll(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)
})


afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('sprints').execute()
})

it('should create a sprint', async () => {
  const sprint = await repository.create({
    code: 'WD-1.1',
    title: 'Web Development Module 1 Sprint 1',
  })

  expect(sprint).toEqual([{
    id: expect.any(Number),
    code: 'WD-1.1',
    title: 'Web Development Module 1 Sprint 1',
  }])

  const sprints = await repository.selectSprints()
  expect(sprints).toHaveLength(1)
})
