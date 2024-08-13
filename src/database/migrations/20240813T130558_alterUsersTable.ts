import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .alterTable('users')
    .addColumn('first_name', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .alterTable('users')
    .addColumn('last_name', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.alterTable('users').dropColumn('first_name').execute()

  await db.schema.alterTable('users').dropColumn('last_name').execute()
}
