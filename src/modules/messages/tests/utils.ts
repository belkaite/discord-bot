import type { Insertable } from 'kysely'
import type { Messages } from '@/database/types'

export const fakeMessage = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => ({
  userId: 1,
  sprintId: 1,
  templateId: 1,
  gifUrl:
    'https://giphy.com/gifs/congratulations-baby-footsiethefoot-J1bFxdlD4fWAYIuVjZ',
  ...overrides,
})

export const messageMatcher = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: expect.any(Number),
  userId: 1,
  sprintId: 1,
  templateId: 1,
  gifUrl:
    'https://giphy.com/gifs/congratulations-baby-footsiethefoot-J1bFxdlD4fWAYIuVjZ',
  createdAt: expect.any(String),
  ...overrides,
})

export const finalMessageMatcher = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: expect.any(Number),
  username: 'RuSau',
  sprintCode: 'CC-1.1',
  template: 'Congrats on completing {sprintTitle}, {username}',
  gifUrl:
    'https://giphy.com/gifs/congratulations-baby-footsiethefoot-J1bFxdlD4fWAYIuVjZ',
  createdAt: expect.any(String),
  ...overrides,
})

