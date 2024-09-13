import { omit } from 'lodash'
import { parse, parseId, parseInsertable } from '../schema'


const fakeMessage = () => ({
  id: 1,
  userId: 1,
  sprintId: 1,
  templateId: 1,
  gifUrl:
    'https://giphy.com/gifs/congratulations-baby-footsiethefoot-J1bFxdlD4fWAYIuVjZ',
  createdAt: '2024-08-29 18:00:39',
})

describe('zod schema validation', () => {
  it('parses a valid message', () => {
    const message = fakeMessage()

    expect(parse(message)).toEqual(message)
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

it('parses a valid gif url', () => {
  const message = { ...fakeMessage(), gifUrl: 'https://valid.url/gif' }

  expect(parse(message)).toEqual(message)
})

it('throws error for invalid gif url', () => {
  const message = { ...fakeMessage(), gifUrl: 'invalid.url/gif' }

  expect(() => parse(message)).toThrowError(/invalid/i)
})

describe('insertable schema validation', () => {
  it('omits id and date when insertable', () => {
    const insertableMessage = omit(fakeMessage(), ['id'], ['createdAt'])
    expect(parseInsertable(insertableMessage)).toEqual(insertableMessage)
  })
})
