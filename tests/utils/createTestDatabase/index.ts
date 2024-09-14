import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely'
import SQLite from 'better-sqlite3'
import { migrateToLatest } from '@/database/migrate'
import { type DB } from '@/database'
import ModuleMigrationProvider from './ModuleMigrationProvider'

const DATABASE_FILE = ':memory:'

export default async () => {
  const provider = new ModuleMigrationProvider()

  const database = new Kysely<DB>({
    dialect: new SqliteDialect({ database: new SQLite(DATABASE_FILE) }),
    plugins: [new CamelCasePlugin()],
  })

  const { results, error } = await migrateToLatest(provider, database)

  results
    ?.filter((result) => result.status === 'Error')
    .forEach((result) => {
      // eslint-disable-next-line no-console
      console.error(`failed to execute migration "${result.migrationName}"`)
    })

  if (error) {
    // eslint-disable-next-line no-console
    console.error('failed to migrate')
    // eslint-disable-next-line no-console
    console.error(error)
  }

  return database
}
