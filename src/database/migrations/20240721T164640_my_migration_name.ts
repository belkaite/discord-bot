import { Kysely, SqliteDialect } from 'kysely';

export async function up(db: Kysely<SqliteDialect>) {
  // Add your migration code here
}

export async function down(db: Kysely<SqliteDialect>) {
  // Add your rollback code here
}
