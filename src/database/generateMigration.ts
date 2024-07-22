
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const currentFileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(currentFileName)

const migrationsDir = path.join(dirName, 'migrations')

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir)
}

const getTimestamp = () => {
  const now = new Date()
  return now.toISOString().replace(/[-:.]/g, '').slice(0, 15)
}

const migrationName = process.argv[2] || 'defaultMigrationName'


const timestamp = getTimestamp()
const fileName = `${timestamp}_${migrationName}.ts`
const filePath = path.join(migrationsDir, fileName)

const template = `import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {

}

export async function down(db: Kysely<SqliteDatabase>) {

}
`

fs.writeFileSync(filePath, template)
console.log(`Created migration file: ${fileName}`)
