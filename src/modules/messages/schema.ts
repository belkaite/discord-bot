import { z } from 'zod'
import type { Messages } from '@/database'

type Record = Messages

const schema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.number().int().positive(),
  sprintId: z.number().int().positive(),
  templateId: z.number().int().positive(),
  gifUrl: z.string().url(),
  createdAt: z.date()
})

const insertable = schema.omit({ id: true, createdAt: true })


export const parse = (record: unknown) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)


export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
