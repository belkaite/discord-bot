import { Kysely } from 'kysely'
import { DB } from '@/database/types'

export async function up(db: Kysely<DB>) {
  await db
    .insertInto('sprints')
    .values([
      { code: 'CC-1.1', title: 'Understanding Purring' },
      { code: 'CC-1.2', title: 'Decoding the Meowing' },
      { code: 'CC-1.3', title: 'The Role of Whiskers' },
      { code: 'CC-1.4', title: 'Tail Tales' },
      { code: 'CC-2.1', title: 'The Midnight Zoomies' },
      { code: 'CC-2.2', title: 'The Cat Nap' },
      { code: 'CC-2.3', title: 'When Cats Want Cuddles' },
      { code: 'CC-2.4', title: 'The Love for Boxes' },
      { code: 'CC-3.1', title: 'Perfecting the Pounce' },
      { code: 'CC-3.2', title: 'Cats and Climbing' },
      { code: 'CC-3.3', title: 'Scratching and Stretching' },
      { code: 'CC-3.4', title: 'The Acrobatics of the Cat' },
      { code: 'CC-4.1', title: 'Choosing the Best Treats' },
      { code: 'CC-4.2', title: 'Understanding Cat Food' },
      { code: 'CC-4.3', title: 'Encouraging Water Intake' },
      { code: 'CC-4.4', title: 'The Effects of Catnip' },
    ])
    .execute()
}

export async function down(db: Kysely<DB>) {
  await db.deleteFrom('sprints').execute()
}
