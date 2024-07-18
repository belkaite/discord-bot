import express from 'express'
import 'dotenv/config'
import { Client, GatewayIntentBits } from 'discord.js'

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

client.on('messageCreate', async (message) => {
  if (message.content === 'ping') {
    const channelId = '1263547998907011197'
    const congratsMessage = 'Congrats on completing your sprint!'
    await sendMessage(channelId, congratsMessage)
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

async function sendMessage(channelId: string, message: string) {
  try {
    const channel = await client.channels.fetch(channelId)
    await channel.send(message)
  } catch (error) {
    console.error('Error fetching the channel or message:', error)
  }
}

app.post('/congrats', async (req, res) => {
  const { channelId, message } = req.body;

  if (!channelId || !message) {
    return res.status(400).json({ error: 'channelId and message are required'})
  }

  try {
    await sendMessage(channelId, message)
    res.status(200).send('Message sent successfully')
  } catch (error) {
    res.status(500).send('Error sending message')
  }

  })