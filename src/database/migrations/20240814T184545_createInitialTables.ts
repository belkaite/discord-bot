import { Kysely, SqliteDatabase, sql } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement())
    .addColumn('username', 'text', (c) => c.notNull().unique())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('sprints')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement())
    .addColumn('code', 'text', (c) => c.notNull().unique())
    .addColumn('title', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('templates')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement())
    .addColumn('content', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('messages')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (c) =>
      c.references('users.id').onDelete('cascade')
    )
    .addColumn('sprint_id', 'integer', (c) =>
      c.references('sprints.id').onDelete('cascade')
    )
    .addColumn('template_id', 'integer', (c) =>
      c.references('templates.id').onDelete('cascade')
    )
    .addColumn('created_at', 'datetime', (c) => c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('sprints').execute()
  await db.schema.dropTable('messages').execute()
  await db.schema.dropTable('templates').execute()
}
