import type { Insertable, Selectable, Updateable, Kysely } from 'kysely'
import type { Sprints, DB } from '@/database/types'
import { keys, parseInsertable, parseUpdateable } from './schema'

const TABLE = 'sprints'
type Row = Sprints
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowSelect = Selectable<Row>
type RowUpdate = Updateable<RowWithoutId>

export default (db: Kysely<DB>) => ({
  async create(sprint: RowInsert): Promise<RowSelect | undefined> {
    parseInsertable(sprint)
    return db
      .insertInto(TABLE)
      .values(sprint)
      .returning(keys)
      .executeTakeFirst()
  },

  async selectAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).selectAll().execute()
  },

  async selectById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },

  async update(id: number, partial: RowUpdate): Promise<RowSelect | undefined > {
    parseUpdateable(partial)
    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },

  async delete(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },
})
