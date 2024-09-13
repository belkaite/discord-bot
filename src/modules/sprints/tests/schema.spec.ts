import { omit } from 'lodash'
import { parse, parseId, parseInsertable, parseUpdateable } from '../schema'


const fakeSprint = () => ({
  id: 1,
  code: 'CC-1.1',
  title: 'Cat Course Module 1 Sprint 1',
})

describe('zod schema validation', () => {
  it('parses a valid sprint', () => {
    const record = fakeSprint()

    expect(parse(record)).toEqual(record)
  })

  it('throws an error when code is less or more than 6 strings', () => {
    const sprintWithoutCode = omit(fakeSprint(), ['code'])
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
    const sprintWithoutTitle = omit(fakeSprint(), ['title'])
    const emptyTitle = {
      ...fakeSprint(),
      title: '',
    }

    expect(() => parse(sprintWithoutTitle)).toThrow(/title/i)
    expect(() => parse(emptyTitle)).toThrow(/title/i)
  })

  it('parses a valid id', () => {
    expect(parseId(1)).toBe(1)
  })

  it('throws an error for invalid id', () => {
    expect(() => parseId('m')).toThrow(/number/i)
    expect(() => parseId(1.25)).toThrow(/integer/i)
    expect(() => parseId(-5)).toThrow(/than 0/i)
  })
})

describe('insertable and updateable schema validation', () => {
  it('omits id when insertable', () => {
    const record = parseInsertable(fakeSprint())
    expect(record).not.toHaveProperty('id')
  })

  it('allows partial updates when updateable', () => {
    const record = parseUpdateable({ title: 'new title' })
    expect(record).toEqual({ title: 'new title' })
  })
})
