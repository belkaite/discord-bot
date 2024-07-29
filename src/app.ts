import express from 'express'
import type { Kysely } from 'kysely'
import messages from './modules/messages/controller'
import sprints from './modules/sprints/controller'
import { type DB } from './database/types'
import jsonErrors from './middleware/jsonErrors'

export default function createApp(database: Kysely<DB>) {
  const app = express()
  app.use(express.json())

  app.use('/messages', messages(database))
  app.use('/sprints', sprints(database))

  app.use(jsonErrors)

  return app
}
