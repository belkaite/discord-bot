import { z } from 'zod';
// import type { Sprints } from '@/database';

const schema = z.object({
    id: z.coerce.number().int().positive(),
    code: z.string().length(6),
    title: z.string().min(1).max(100)
})

export const parse = (record: unknown ) => schema.parse(record)