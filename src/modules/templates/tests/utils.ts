import type { Insertable } from 'kysely'
import type { Templates } from '@/database/types'

export const fakeTemplate = (
  overrides: Partial<Insertable<Templates>> = {}
): Insertable<Templates> => ({
  content: 'Congrats on completing {sprintTitle}, {username}',
  ...overrides,
})

export const templateMatcher = (overrides: Partial<Insertable<Templates>> = {}) => ({
  id: expect.any(Number),
  content: 'Congrats on completing {sprintTitle}, {username}',
  ...overrides,
})

