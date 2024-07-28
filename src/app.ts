import express from 'express'
import type { Kysely } from 'kysely'
import messageRoutes from './modules/messages/controller'
import sprints from './modules/sprints/controller'
import { type DB } from './database/types'

export default function createApp(database: Kysely<DB>) {
  const app = express()
  app.use(express.json())

  app.use('/messages', messageRoutes)
  app.use('/sprints', sprints(database))

  return app
}
