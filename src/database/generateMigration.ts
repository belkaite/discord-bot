
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const currentFileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(currentFileName)

const migrationsDir = path.join(dirName, 'migrations')

// Ensure the migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir)
}

const getTimestamp = () => {
  const now = new Date()
  return now.toISOString().replace(/[-:.]/g, '').slice(0, 15)
}

const migrationName = process.argv[2]
if (!migrationName) {
  console.error('Please provide a migration name.')
  process.exit(1)
}

const timestamp = getTimestamp()
const fileName = `${timestamp}_${migrationName}.ts`
const filePath = path.join(migrationsDir, fileName)

const template = `import { Kysely, SqliteDialect } from 'kysely';

export async function up(db: Kysely<SqliteDialect>) {
  // Add your migration code here
}

export async function down(db: Kysely<SqliteDialect>) {
  // Add your rollback code here
}
`

fs.writeFileSync(filePath, template)
console.log(`Created migration file: ${fileName}`)
