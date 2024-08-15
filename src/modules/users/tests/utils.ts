import type { Insertable } from 'kysely'
import type { Users } from '@/database/types'

export const fakeUser = (
  overrides: Partial<Insertable<Users>> = {}
): Insertable<Users> => ({
  username: 'RuSau',
  firstName: 'Ruta',
  lastName: 'Saule',
  ...overrides,
})

export const userMatcher = (
  overrides: Partial<Insertable<Users>> = {}
) => ({
  id: expect.any(Number),
  username: 'RuSau',
  firstName: 'Ruta',
  lastName: 'Saule',
  ...overrides,
})
