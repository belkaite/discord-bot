import { Client, GatewayIntentBits, TextChannel } from 'discord.js'
import 'dotenv/config'

const { CHANNEL_ID } = process.env

if (!CHANNEL_ID) {
  throw new Error('Provide CHANNEL_ID in environment variables')
}

const channelId: string = CHANNEL_ID

const { DISCORD_BOT_TOKEN } = process.env

export function createClient() {
  return new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  })
}

const client = createClient()

client.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log('😸bot is ready')
})

client.login(DISCORD_BOT_TOKEN)

export async function sendMessage(message: string) {
  try {
    const channel = await client.channels.fetch(channelId)
    if (channel?.isTextBased()) {
      await (channel as TextChannel).send(message)
    } else {
      // eslint-disable-next-line no-console
      console.error('The channel is not text-based or does not exist')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching the channel or message:', error)
  }
}
