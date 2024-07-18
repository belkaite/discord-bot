import 'dotenv/config'
import { Client, GatewayIntentBits } from 'discord.js'

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
    message.reply({
      content: 'pong',
    })
  }
})

client.login(process.env.DISCORD_BOT_ID)
