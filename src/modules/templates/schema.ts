import { z } from 'zod'
import { Templates } from '@/database/types'

type Record = Templates
const schema = z.object({
  id: z.coerce.number().positive().int(),
  content: z.string().min(1).max(250),
})

const insertable = schema.omit({ id: true })
const updateable = schema.partial()

export const parse = (record: unknown) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdateable = (record: unknown) => updateable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
