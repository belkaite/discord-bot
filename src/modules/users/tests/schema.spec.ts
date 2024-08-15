import { omit } from 'lodash'
import { parse, parseId, parseInsertable } from '../schema'

const fakeUser = () => ({
  id: 1,
  username: 'RuSau',
  firstName: 'Ruta',
  lastName: 'Saule',
})

describe('zod schema validation', () => {
  it('parses a valid user', () => {
    const user = fakeUser()

    expect(parse(user)).toEqual(user)
  })

  it('throws an error due to missing username', () => {
    const userWithEmptyUsername = { ...fakeUser(), username: '' }
    const userWithNoUserName = omit(fakeUser(), ['username'])

    expect(() => parse(userWithEmptyUsername)).toThrow(/username/i)
    expect(() => parse(userWithNoUserName)).toThrow(/username/i)
  })

  it('throws an error due to missing first name', () => {
    const userWithEmptyFirstName = { ...fakeUser(), firstName: '' }
    const userWithNoFirstName = omit(fakeUser(), ['firstName'])

    expect(() => parse(userWithEmptyFirstName)).toThrow(/firstName/i)
    expect(() => parse(userWithNoFirstName)).toThrow(/firstName/i)
  })

  it('throws an error due to missing last name', () => {
    const userWithEmptyLastName = { ...fakeUser(), lastName: '' }
    const userWithNoLastName = omit(fakeUser(), ['lastName'])

    expect(() => parse(userWithEmptyLastName)).toThrow(/lastName/i)
    expect(() => parse(userWithNoLastName)).toThrow(/lastName/i)
  })

  it('parses a valid id', () => {
    expect(parseId(1)).toBe(1)
  })

  it('throws an error for invalid id', () => {
    expect(() => parseId('m')).toThrow(/number/i)
    expect(() => parseId(1.25)).toThrow(/integer/i)
    expect(() => parseId(-5)).toThrow(/than 0/i)
  })

  describe('insertable and updateable schema validation', () => {
    it('omits id when insertable', () => {
      const record = parseInsertable(fakeUser())
      expect(record).not.toHaveProperty('id')
    })
  })
})
