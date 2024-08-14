import { Router } from 'express'
import type { Kysely } from 'kysely'
import { StatusCodes } from 'http-status-codes'
import { sendMessage } from '@/discordClient'
import type { DB } from '@/database/types'
import buildSprintsRepository from '@/modules/sprints/repository'
import buildTemplatesRepository from '@/modules/templates/repository'
import buildUsersRepository from '@/modules/users/repository'

export default (database: Kysely<DB>) => {
  const router = Router()
  const sprintsRepository = buildSprintsRepository(database)
  const templatesRepository = buildTemplatesRepository(database)
  const usersRepository = buildUsersRepository(database)

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

    let templates

    try {
      templates = await templatesRepository.selectAll()
      if (templates.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'No templates' })
      }
    } catch (error) {
      return res.status(500).send('Error getting templates')
    }

    let user

    try {
      user = await usersRepository.selectByUsername(username)
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'User not found' })
      }
    } catch (error) {
      return res.status(500).send('Error finding the user')
    }

    const template =
      templates[Math.floor(Math.random() * templates.length)].content

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
