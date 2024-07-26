import type { Insertable, Selectable, Kysely } from 'kysely'
import type { Sprints, DB } from '@/database/types'

const TABLE = 'sprints'
type Row = Sprints
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowSelect = Selectable<Row>

export default (db: Kysely<DB>) => ({
  async create(sprint: RowInsert): Promise<Row> {
    return db
      .insertInto(TABLE)
      .values(sprint)
      .returning(['id', 'code', 'title'])
      .execute()
  },

  async selectSprints(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).selectAll().execute()
  },
})
