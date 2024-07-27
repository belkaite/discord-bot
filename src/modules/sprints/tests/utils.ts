import type { Insertable } from 'kysely'
import type { Sprints } from '@/database/types'

export const fakeSprint = (
  overrides: Partial<Insertable<Sprints>>
): Insertable<Sprints> => ({
  code: 'WD-1.1',
  title: 'Web Development Module 1 Sprint 1',
  ...overrides,
})

export const sprintMatcher = (overrides: Partial<Insertable<Sprints>>) => ({
  id: expect.any(Number),
  code: 'WD-1.1',
  title: 'Web Development Module 1 Sprint 1',
  ...overrides,
})
