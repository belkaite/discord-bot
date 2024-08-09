import { Router } from 'express'
import type { Kysely } from 'kysely'
import { StatusCodes } from 'http-status-codes'
import { sendMessage } from '@/discordClient'
import type { DB } from '@/database/types'
import buildSprintsRepository from '@/modules/sprints/repository'

export default (database: Kysely<DB>) => {
  const router = Router()
  const sprintsRepository = buildSprintsRepository(database)

  router.post('/', async (req, res) => {
    const { username, sprintCode } = req.body

    let sprint

    try {
      sprint = await sprintsRepository.selectByCode(sprintCode)
      if (!sprint) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Sprint not found' })
      }
    } catch (error) {
      return res.status(500).send('Error finding sprint')
    }

    const templates = [
      `Congrats on completing {sprintTitle}, {username}`,
      `Well done, {username}. You finished {sprintTitle}`,
    ]

    const users = [
      { username: 'monikabelkaite' },
      { username: 'jevgenijgamper' },
    ]

    const user = users.find((u) => u.username === username)
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    const template = templates[Math.floor(Math.random() * templates.length)]

    const congratsMessage = template
      .replace('{username}', username)
      .replace('{sprintTitle}', sprint.title)

    try {
      await sendMessage(congratsMessage)
      return res.status(200).send('Message sent successfully')
    } catch (error) {
      return res.status(500).send('Error sending message')
    }
  })

  return router
}
