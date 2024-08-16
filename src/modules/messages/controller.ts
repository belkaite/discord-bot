import { Router } from 'express'
import type { Kysely } from 'kysely'
import { StatusCodes } from 'http-status-codes'
import fetch from 'node-fetch'
import { sendMessage } from '@/discordClient'
import type { DB } from '@/database/types'
import buildSprintsRepository from '@/modules/sprints/repository'
import buildTemplatesRepository from '@/modules/templates/repository'
import buildUsersRepository from '@/modules/users/repository'

const { GIPHY_API_KEY } = process.env

if (!GIPHY_API_KEY) {
  throw new Error('Provide GIPHY API KEY')
}

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
      .replace('{firstName}', user.firstName)
      .replace('{lastName}', user.lastName)
      .replace('{sprintTitle}', sprint.title)

    let gifUrl

    try {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=congratulations&rating=g`
      const response = await fetch(url)
      const data = await response.json()
      const index = Math.floor(Math.random() * data.data.length)
      gifUrl = data.data[index].url
    } catch (error) {
      console.error('Error fetching GIF from Giphy API:', error)
    }

    try {
      await sendMessage(congratsMessage)
      await sendMessage(gifUrl)
      return res.status(200).send('Message sent successfully')
    } catch (error) {
      return res.status(500).send('Error sending message')
    }
  })

  return router
}
