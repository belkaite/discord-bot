import { Router } from 'express'
import type { Kysely } from 'kysely'
import { StatusCodes } from 'http-status-codes'
import buildRepository from './repository'
import type { DB } from '@/database/types'
import * as schema from './schema'

export default (database: Kysely<DB>) => {
  const router = Router()
  const usersRepository = buildRepository(database)

  router.get('/', async (req, res, next) => {
    try {
      const users = await usersRepository.selectAll()
      res.status(StatusCodes.OK).json(users)
    } catch (error) {
      next(error)
    }
  })

  router.get('/:username', async (req, res, next) => {
    try {
      const { username } = req.params
      const user = await usersRepository.selectByUsername(username)
      if (user) {
        res.status(StatusCodes.OK).json(user)
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' })
      }
    } catch (error) {
      next(error)
    }
  })

  router.post('/', async (req, res, next) => {
    try {
      const body = schema.parseInsertable(req.body)
      const user = await usersRepository.create(body)
      res.status(StatusCodes.CREATED).json(user)
    } catch (error) {
      next(error)
    }
  })

  router.all('/', (req, res) => {
    res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: 'Method not allowed' })
  })

  router.all('/:username', (req, res) => {
    res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: 'Method not allowed' })
  })

  return router
}
