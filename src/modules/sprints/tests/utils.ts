import type { Insertable } from 'kysely'
import type { Sprints } from '@/database/types'

export const fakeSprint = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  code: 'CC-1.1',
  title: 'Cat Course Module 1 Sprint 1',
  ...overrides,
})

export const sprintMatcher = (overrides: Partial<Insertable<Sprints>> = {}) => ({
  id: expect.any(Number),
  code: 'CC-1.1',
  title: 'Cat Course Module 1 Sprint 1',
  ...overrides,
})
