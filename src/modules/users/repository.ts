import type { Insertable, Selectable, Kysely } from 'kysely'
import type { Users, DB } from '@/database/types'
import { keys } from './schema'

const TABLE = 'users'
type Row = Users
type RowInsert = Insertable<Row>
type RowSelect = Selectable<Row>

export default (db: Kysely<DB>) => ({
  async create(user: RowInsert): Promise<RowSelect | undefined> {
    return db.insertInto(TABLE).values(user).returning(keys).executeTakeFirst()
  },

  async selectById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },

  async selectByUsername(username: string): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('username', '=', username)
      .executeTakeFirst()
  },
})
