// import createTestDatabase from '@tests/utils/createTestDatabase'
// import type { Kysely } from 'kysely'
// import buildRepository from '../repository'
// import type { DB } from '@/database/types'
// import { fakeUser, userMatcher } from './utils'

// type UsersRepository = ReturnType<typeof buildRepository>

// let db: Kysely<DB>
// let repository: UsersRepository

// beforeAll(async () => {
//   db = await createTestDatabase()
//   repository = buildRepository(db)
// })

// afterEach(async () => {
//   await db.deleteFrom('users').execute()
// })

// afterAll(() => db.destroy())

// describe('create', () => {
//   it('should create a user', async () => {
//     const user = await repository.create(fakeUser())

//     expect(user).toEqual(userMatcher())

//     const users = await repository.selectAll()
//     expect(users).toHaveLength(1)
//     expect(users[0]).toEqual(user)
//   })

//   it('should select the user by the id', async () => {
//     await repository.create(fakeUser({ id: 10 }))

//     const foundUser = await repository.selectById(10)

//     expect(foundUser).toEqual(userMatcher({ id: 10 }))
//   })

//   it('should return undefined when searching for a user with non existing ID', async () => {
//     const notFoundUser = await repository.selectById(1000)

//     expect(notFoundUser).toBeUndefined()
//   })
// })
