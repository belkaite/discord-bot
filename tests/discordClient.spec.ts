import { sendMessage } from '../src/discordClient'

vi.mock('discord.js', () => ({
  Client: vi.fn(() => ({
    channels: {
      fetch: vi.fn().mockResolvedValue({
        isTextBased: vi.fn().mockReturnValue(true),
        send: vi.fn().mockResolvedValue(true),
      }),
    },
    login: vi.fn(),
    on: vi.fn(),
  })),
  GatewayIntentBits: {
    Guilds: 'GUILDS',
    GuildMessages: 'GUILD_MESSAGES',
  },
}))

it('should send a message to discord', async () => {
  const message = 'Congrats on finishing the sprint'

  const spySendMessage = vi.spyOn(await import('../src/discordClient'),
    'sendMessage'
  )

  await sendMessage(message)

  expect(spySendMessage).toHaveBeenCalledWith(message)
})
