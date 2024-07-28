import { Router } from 'express'
import type { Kysely } from 'kysely'
import buildRepository from './repository'
import type { DB } from '@/database/types'
import * as schema from './schema'

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

  router.get('/:id', async (req, res) => {
    try {
      const id = schema.parseId(req.params.id)
      const sprint = await sprints.selectById(id)
      if (sprint) {
        res.status(200).json(sprint)
      } else {
        res.status(404).json({ error: e.message })
      }
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.post('/', async (req, res) => {
    try {
      const body = schema.parseInsertable(req.body)
      const sprint = await sprints.create(body)
      res.status(201).json(sprint)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.patch('/:id', async (req, res) => {
    try {
      const id = schema.parseId(req.params.id)
      const bodyPatch = schema.parseUpdateable(req.body)
      const sprint = await sprints.update(id, bodyPatch)
      res.status(200).json(sprint)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.delete('/:id', async (req, res) => {
    try {
      const id = schema.parseId(req.params.id)
      const sprint = await sprints.delete(id)
      if (sprint) {
        res.status(204).send() // 204 No Content
      } else {
        res.status(404).json({ error: 'Sprint not found' })
      }
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  return router
}
