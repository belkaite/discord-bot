import { Kysely } from 'kysely'
import { DB } from '@/database/types'

export async function up(db: Kysely<DB>) {
  await db
    .insertInto('templates')
    .values([
      {
        content:
          '{username} just mastered {sprintTitle}! You’ve got the sharpest claws in the game. 🐾',
      },
      {
        content: '{username} completed {sprintTitle}! Purrfect performance. 😸',
      },
      {
        content:
          '{username} has finished {sprintTitle}! You’ve earned a cat nap and some treats. 🛌🍖',
      },
      {
        content:
          '{username} just finished {sprintTitle}! You’re the top cat in the tree now. 🐱🎉',
      },
      {
        content:
          '{username} nailed {sprintTitle}! Time to stretch, scratch and celebrate. 😺🎊',
      },
      {
        content:
          '{username} completed {sprintTitle}! You’ve got the agility of a cat on the hunt. 🐈🏆',
      },
      {
        content:
          '{username} finished {sprintTitle}! You’ve climbed to the top of the cat tree. 🌳🐱',
      },
      {
        content:
          '{username} just finished {sprintTitle}! You’ve got more lives left for even bigger wins. 🐾🥳',
      },
      {
        content:
          '{username} completed {sprintTitle}! Your skills are sharper than a cat’s claws. 🐱💥',
      },
      {
        content:
          '{username} mastered {sprintTitle}! You’ve unlocked the secret to the purrfect life. 🐾✨',
      },

      {
        content:
          '{username} finished {sprintTitle}! You’re officially the top cat in the alley. 😼🏅',
      },
    ])
    .execute()
}

export async function down(db: Kysely<DB>) {
  await db.deleteFrom('templates').execute()
}
