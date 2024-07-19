import express from 'express'
import 'dotenv/config'
import { Client, GatewayIntentBits } from 'discord.js'

const channelId = '1263547998907011197'
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.on('ready', () => {
  console.log('bot is ready')
})

// sukonfiguruoju, ka botui reik daryt
client.on('messageCreate', async (message) => {
  if (message.content === 'ping') {
    const congratsMessage = 'Congrats on completing your sprint!'
    await sendMessage(channelId, congratsMessage)
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

async function sendMessage(message: string) {
  try {
    const channel = await client.channels.fetch(channelId)
    await channel.send(message)
  } catch (error) {
    console.error('Error fetching the channel or message:', error)
  }
}

const users = [{ username: 'monikabelkaite' }, { username: 'jevgenijgamper' }]

const sprints = [
  { code: 'WD-1.1', title: 'Web dev Sprint 1.1' },
  { code: 'WD-1.2', title: 'Web dev Sprint 1.2' },
]

const templates = [
  `Congrats on completing {sprintTitle}, {username}`,
  `Well done, {username}. You finished {sprintTitle}`,
]

app.post('/congrats', async (req, res) => {
  const { userName, sprintCode } = req.body

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
    res.status(200).send('Message sent successfully')
  } catch (error) {
    res.status(500).send('Error sending message')
  }
})
