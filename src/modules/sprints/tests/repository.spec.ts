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

  expect(sprint).toEqual({
    id: expect.any(Number),
    code: 'WD-1.1',
    title: 'Web Development Module 1 Sprint 1',
  })

  const sprints = await repository.selectAll()
  expect(sprints).toHaveLength(1)
  expect(sprints[0]).toEqual(sprint)
})

it('should find a sprint by ID', async () => {
  await repository.create({
    id: 10,
    code: 'WD-1.1',
    title: 'Web Development Module 1 Sprint 1',
  })

  const foundSprint = await repository.selectById(10)

  expect(foundSprint).toEqual({
    id: 10,
    code: 'WD-1.1',
    title: 'Web Development Module 1 Sprint 1',
  })
})

it('should update the sprint', async () => {
  const sprint = await repository.create({
    id: 10,
    code: 'WD-1.1',
    title: 'Web Development Module 1 Sprint 1',
  })

  const updatedSprint = await repository.update(sprint.id, {
    title: 'Web Dev Module 1 Sprint',
  })

  expect(updatedSprint).toEqual({
    id: 10,
    code: 'WD-1.1',
    title: 'Web Dev Module 1 Sprint',
  })
})

it('should delete the sprint', async () => {
  const sprint = await repository.create({
    id: 10,
    code: 'WD-1.1',
    title: 'Web Development Module 1 Sprint 1',
  })

  const deletedSprint = await repository.delete(sprint.id)

  const sprints = await repository.selectAll()
  expect(sprints).toHaveLength(0)
})
