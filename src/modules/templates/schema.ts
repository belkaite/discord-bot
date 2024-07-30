import { z } from 'zod'
import { Templates } from '@/database/types'

const schema = z.object({
    id: z.coerce.number().positive().int(),
    content: z.string().min(1).max(100)

})

export const parse = (record: unknown) => schema.parse(record)