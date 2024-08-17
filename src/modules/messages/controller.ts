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

interface GiphyGif {
  url: string
}

interface GiphyApiResponse {
  data: GiphyGif[]
}

export default (database: Kysely<DB>) => {
  const router = Router()
  const sprintsRepository = buildSprintsRepository(database)
  const templatesRepository = buildTemplatesRepository(database)
  const usersRepository = buildUsersRepository(database)

  router.post('/', async (req, res) => {
    const { username, sprintCode } = req.body

    let sprint
    let templates
    let user

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

    try {
      templates = await templatesRepository.selectAll()
      if (templates.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'No templates' })
      }
    } catch (error) {
      return res.status(500).send('Error getting templates')
    }

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

    let gifUrl: string | undefined

    try {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=congratulations&rating=g`
      const response = await fetch(url)
      const data = (await response.json()) as GiphyApiResponse
      const index = Math.floor(Math.random() * data.data.length)
      gifUrl = data.data[index].url
    } catch (error) {
      return res.status(500).json('Failed to fetch a GIF from Giphy')
    }

    if (!gifUrl) {
      throw new Error('Failed to fetch a valid GIF URL from Giphy API')
    }

    try {
      await sendMessage(congratsMessage)
      await sendMessage(gifUrl)
      return res.status(200).send('Message sent successfully')
    } catch (error) {
      return res.status(500).send('Failed to send the message')
    }
  })

  return router
}
