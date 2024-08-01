import type { Insertable, Selectable, Updateable, Kysely } from 'kysely'
import type { DB, Templates } from '@/database/types'
import { keys, parseInsertable, parseUpdateable } from './schema'

const TABLE = 'templates'
type Row = Templates
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowSelect = Selectable<Row>
type RowUpdate = Updateable<RowWithoutId>

export default (db: Kysely<DB>) => ({
  async create(template: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(template)
      .returning(keys)
      .executeTakeFirst()
  },

  async selectAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).selectAll().execute()
  },

  async selectByID(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },
})
