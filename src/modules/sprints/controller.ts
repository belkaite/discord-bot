import { Router } from 'express'
import type { Kysely } from 'kysely'
import { StatusCodes } from 'http-status-codes'
import buildRepository from './repository'
import type { DB } from '@/database/types'
import * as schema from './schema'

export default (database: Kysely<DB>) => {
  const router = Router()
  const sprints = buildRepository(database)

  router.get('/', async (req, res, next) => {
    try {
      const allSprints = await sprints.selectAll()
      res.status(StatusCodes.OK).json(allSprints)
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const id = schema.parseId(req.params.id)
      const sprint = await sprints.selectById(id)
      if (sprint) {
        res.status(StatusCodes.OK).json(sprint)
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Sprint not found' })
      }
    } catch (error) {
      next(error)
    }
  })

  router.post('/', async (req, res, next) => {
    try {
      const body = schema.parseInsertable(req.body)
      const sprint = await sprints.create(body)
      res.status(StatusCodes.CREATED).json(sprint)
    } catch (error) {
      next(error)
    }
  })

  router.patch('/:id', async (req, res, next) => {
    try {
      const id = schema.parseId(req.params.id)
      const bodyPatch = schema.parseUpdateable(req.body)
      const sprint = await sprints.update(id, bodyPatch)
      res.status(StatusCodes.OK).json(sprint)
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const id = schema.parseId(req.params.id)
      const deletedSprint = await sprints.delete(id)
      if (deletedSprint) {
        res.status(StatusCodes.NO_CONTENT).send()
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Sprint not found' })
      }
    } catch (error) {
      next(error)
    }
  })

  return router
}
