import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Messages {
  id: Generated<number>
  sprintId: number
  templateId: number
  timestamp: Generated<number>
  userId: number
}

export interface Sprints {
  code: string
  id: Generated<number>
  title: string
}

export interface Templates {
  content: string
  id: Generated<number>
}

export interface Users {
  id: Generated<number>
  username: string
}

export interface DB {
  messages: Messages
  sprints: Sprints
  templates: Templates
  users: Users
}
