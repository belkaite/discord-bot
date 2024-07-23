import { Router } from 'express'
import { sendMessage } from '@/discordClient'

const router = Router()

router.post('/', async (req, res) => {
  const { userName, sprintCode } = req.body

  const sprints = [
    { code: 'WD-1.1', title: 'Web dev Sprint 1.1' },
    { code: 'WD-1.2', title: 'Web dev Sprint 1.2' },
  ]

  const templates = [
    `Congrats on completing {sprintTitle}, {username}`,
    `Well done, {username}. You finished {sprintTitle}`,
  ]

  const users = [{ username: 'monikabelkaite' }, { username: 'jevgenijgamper' }]

  const user = users.find((u) => u.username === userName)
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  const sprint = sprints.find((s) => s.code === sprintCode)
  if (!sprint) {
    return res.status(404).json({ error: 'user not found' })
  }

  const template = templates[Math.floor(Math.random() * templates.length)]

  const congratsMessage = template
    .replace('{username}', userName)
    .replace('{sprintTitle}', sprintCode)

  try {
    await sendMessage(congratsMessage)
    return res.status(200).send('Message sent successfully')
  } catch (error) {
    return res.status(500).send('Error sending message')
  }
})

export default router
