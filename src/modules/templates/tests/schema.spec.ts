import { omit } from 'lodash'
import { parse, parseId, parseInsertable, parseUpdateable } from '../schema'

const fakeTemplate = (overrides = {}) => ({
  id: 1,
  content: 'Congrats on completing {sprintTitle}, {username}',
  ...overrides,
})

describe('zod schema validation', () => {
  it('parses a valid template', () => {
    const template = fakeTemplate()

    expect(parse(template)).toEqual(template)
  })

  it('throws an error due to missing content', () => {
    const templateWithEmptyContent = fakeTemplate({ content: '' })
    const templateWithNoContent = omit(fakeTemplate(), ['content'])

    expect(() => parse(templateWithEmptyContent)).toThrow(/content/i)
    expect(() => parse(templateWithNoContent)).toThrow(/content/i)
  })

  it('parses a valid id', () => {
    expect(parseId(1)).toBe(1)
  })

  it('throws an error for invalid id', () => {
    expect(() => parseId('m')).toThrow(/number/i)
    expect(() => parseId(1.25)).toThrow(/integer/i)
    expect(() => parseId(-5)).toThrow(/than 0/i)
  })

  it('throws an error when content is more than 100 strings', () => {
    const contentWithTooLongName = {
      ...fakeTemplate(),
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula accumsan nunc, a tempor sapien ornare id. Curabitur dictum.',
    }

    expect(() => parse(contentWithTooLongName)).toThrow(/code/i)
  })
})

describe('insertable and updateable schema validation', () => {
  it('omits id when insertable', () => {
    const record = parseInsertable(fakeTemplate())
    expect(record).not.toHaveProperty('id')
  })

  it('allows partial updates when updateable', () => {
    const record = parseUpdateable({ content: 'Cats Forever' })
    expect(record).toEqual({ content: 'Cats Forever' })
  })
})
