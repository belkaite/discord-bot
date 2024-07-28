import { Router } from 'express'
import type { Kysely } from 'kysely'
import buildRepository from './repository'
import type { DB } from '@/database/types'

export default (database: Kysely<DB>) => {
  const router = Router()
  const sprints = buildRepository(database)

  router.get('/', async (req, res) => {
    try {
      const allSprints = await sprints.selectAll()
      res.status(200).json(allSprints)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  return router
}
