import type { Insertable, Selectable, Kysely } from 'kysely'
import type { Messages, DB } from '@/database/types'
import { keys } from './schema'

const TABLE = 'messages'
type Row = Messages
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowSelect = Selectable<Row>

type MessageWithRelations = {
  id: number
  createdAt: string
  username: string
  sprintCode: string
  template: string
  gifUrl: string
}

export default (db: Kysely<DB>) => ({
  async create(message: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(message)
      .returning(keys)
      .executeTakeFirst()
  },

  async select(
    username: string,
    sprintCode: string
  ): Promise<MessageWithRelations[]> {
    let query = db
      .selectFrom(TABLE)
      .innerJoin('users', 'users.id', 'messages.userId')
      .innerJoin('sprints', 'sprints.id', 'messages.sprintId')
      .innerJoin('templates', 'templates.id', 'messages.templateId')
      .select([
        'messages.id',
        'users.username as username',
        'sprints.code as sprintCode',
        'templates.content as template',
        'messages.gifUrl as gifUrl',
        'messages.createdAt as createdAt',
      ])

    if (username) {
      query = query.where('users.username', '=', username)
    }

    if (sprintCode) {
      query = query.where('sprints.code', '=', sprintCode)
    }

    return query.execute()
  },
})
