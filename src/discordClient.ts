import { Client, GatewayIntentBits, TextChannel} from 'discord.js'

const channelId = '1263547998907011197'

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
    await sendMessage(channelId)
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)

export async function sendMessage(message: string) {
  try {
    const channel = await client.channels.fetch(channelId)
    if (channel?.isTextBased()) {
      await(channel as TextChannel).send(message)
    } else {
      console.error('The channel is not text-based or does not exist')
    }
  } catch (error) {
    console.error('Error fetching the channel or message:', error)
  }
}

export const setupDiscordClient = () => client
