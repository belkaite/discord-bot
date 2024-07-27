import createTestDatabase from '@tests/utils/createTestDatabase'
import buildRepository from '../repository'
import { sprintMatcher, fakeSprint } from './utils'

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

it('should create a sprint and get a sprint', async () => {
  const sprint = await repository.create(fakeSprint())

  expect(sprint).toEqual(sprintMatcher())

  const sprints = await repository.selectAll()
  expect(sprints).toHaveLength(1)
  expect(sprints[0]).toEqual(sprint)
})

it('should find a sprint by ID', async () => {
  await repository.create(fakeSprint({id: 10}))

  const foundSprint = await repository.selectById(10)

  expect(foundSprint).toEqual(sprintMatcher({ id: 10}))
})

it('should update the sprint', async () => {
  const sprint = await repository.create(fakeSprint({ id: 10}))

  const updatedSprint = await repository.update(sprint.id, {
    title: 'Web Dev Module 1 Sprint',
  })

  expect(updatedSprint).toEqual(
    sprintMatcher({ id: 10, title: 'Web Dev Module 1 Sprint' })
  )
})

it('should delete the sprint', async () => {
  const sprint = await repository.create(fakeSprint({id: 10}))

  const deletedSprint = await repository.delete(sprint.id)

  const sprints = await repository.selectAll()
  expect(sprints).toHaveLength(0)
})
