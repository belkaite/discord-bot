import 'dotenv/config'
import createApp from './app'
import createDatabase from './database'

const { DATABASE_URL } = process.env
const port = 3000

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in evironment variables')
}
const database = createDatabase(DATABASE_URL)
const app = createApp(database)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${port}`)
})
