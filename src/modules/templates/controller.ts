import { Kysely } from 'kysely'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { DB } from '@/database/types'
import buildrepository from './repository'
import * as schema from './schema'

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

  router.get('/:id', async (req, res, next) => {
    try {
      const id = schema.parseId(req.params.id)
      const template = await templates.selectByID(id)
      if (template) {
        res.status(StatusCodes.OK).json(template)
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Template not found' })
      }
    } catch (error) {
      next(error)
    }
  })

  router.post('/', async (req, res, next) => {
    try {
      const body = schema.parseInsertable(req.body)
      const template = await templates.create(body)
      res.status(StatusCodes.CREATED).json(template)
    } catch (error) {
      next(error)
    }
  })

  router.patch('/:id', async (req, res, next) => {
    try {
      const id = schema.parseId(req.params.id)
      const body = schema.parseUpdateable(req.body)
      const template = await templates.update(id, body)
      res.status(StatusCodes.OK).json(template)
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const id = schema.parseId(req.params.id)
      const deletedTemplate = await templates.delete(id)
      if (deletedTemplate) {
        res.status(StatusCodes.NO_CONTENT).send()
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Template not found' })
      }
    } catch (error) {
      next(error)
    }
  })

  return router
}
