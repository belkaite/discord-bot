import type { Insertable, Selectable, Updateable, Kysely } from 'kysely'
import type { DB, Templates } from '@/database/types'
import { keys } from './schema'

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

  async update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },

  async delete(id: number) {
    return db.deleteFrom(TABLE).where('id', '=', id).returning(keys).executeTakeFirst()
  },
})
