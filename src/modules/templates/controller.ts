import { Kysely } from 'kysely'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { DB } from '@/database/types'
import buildrepository from './repository'

export default (database: Kysely<DB>) => {
  const router = Router()
  const templates = buildrepository(database)

  router.get('/', async (req, res, next) => {
    try {
      const allTemplates = await templates.selectAll()
      res.status(StatusCodes.OK).json(allTemplates)
    } catch (error) {
      next(error)
    }
  })
  return router
}
