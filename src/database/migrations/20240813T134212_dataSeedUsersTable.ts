import { Kysely } from 'kysely'
import { DB } from '@/database/types'

export async function up(db: Kysely<DB>) {
  await db
    .insertInto('users')
    .values([
      { username: 'RuSau', first_name: 'Ruta', last_name: 'Saule' },
      { username: 'DaMen', first_name: 'Dainius', last_name: 'Menulis' },
      { username: 'MiJur', first_name: 'Milda', last_name: 'Jura' },
      { username: 'JuAzu', first_name: 'Julius', last_name: 'Azuolas' },
      { username: 'AgUpe', first_name: 'Agne', last_name: 'Upe' },
      { username: 'LiKar', first_name: 'Liudas', last_name: 'Karalius' },
      { username: 'LiLie', first_name: 'Lina', last_name: 'Liepa' },
      { username: 'RoMis', first_name: 'Rokas', last_name: 'Miskas' },
      { username: 'KrKop', first_name: 'Kristina', last_name: 'Kopa' },
      { username: 'GeVak', first_name: 'Gediminas', last_name: 'Vakaras' },
    ])
    .execute()
}

export async function down(db: Kysely<DB>) {
  await db.deleteFrom('users').execute()
}
