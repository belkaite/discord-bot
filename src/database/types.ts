import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Messages {
  id: Generated<number | null>
  sprintId: number | null
  templateId: number | null
  timestamp: Generated<number>
  userId: number | null
}

export interface Sprints {
  code: string
  id: Generated<number | null>
  title: string
}

export interface Templates {
  content: string
  id: Generated<number | null>
}

export interface Users {
  first_name: string
  id: Generated<number | null>
  last_name: string
  username: string
}

export interface DB {
  messages: Messages
  sprints: Sprints
  templates: Templates
  users: Users
}
