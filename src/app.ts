import express from 'express'
import type { Kysely } from 'kysely'
import messages from './modules/messages/controller'
import sprints from './modules/sprints/controller'
import templates from './modules/templates/controller'
import users from './modules/users/controller'
import { type DB } from './database/types'
import jsonErrors from './middleware/jsonErrors'

export default function createApp(database: Kysely<DB>) {
  const app = express()
  app.use(express.json())

  app.use('/messages', messages(database))
  app.use('/sprints', sprints(database))
  app.use('/templates', templates(database))
  app.use('/users', users(database))

  app.use(jsonErrors)

  return app
}
