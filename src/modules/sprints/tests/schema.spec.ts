import { omit } from 'lodash/fp'
import { parse } from '../schema'

const fakeSprint = () => ({
  id: 1,
  code: 'WD-1.1',
  title: 'Web Development Module 1 Sprint 1',
})

it('parses a valid sprint', () => {
  const record = fakeSprint()

  expect(parse(record)).toEqual(record)
})

it('throws an error when code is less or more than 6 strings', () => {
  const sprintWithoutCode = omit(['code'], fakeSprint())
  const sprintWithShortCode = {
    ...fakeSprint(),
    code: 'WD',
  }
  const sprintWithLongCode = {
    ...fakeSprint(),
    code: 'WD-1.155',
  }

  expect(() => parse(sprintWithShortCode)).toThrow(/code/i)
  expect(() => parse(sprintWithLongCode)).toThrow(/code/i)
  expect(() => parse(sprintWithoutCode)).toThrow(/code/i)
})

it('throws an error due to missing title', () => {
  const sprintWithoutTitle = omit(['title'], fakeSprint())
  const emptyTitle = {
    ...fakeSprint(),
    title: '',
  }

  expect(() => parse(sprintWithoutTitle)).toThrow(/title/i)
  expect(() => parse(emptyTitle)).toThrow(/title/i)
})
