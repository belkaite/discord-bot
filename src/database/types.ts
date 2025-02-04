import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Messages {
  createdAt: Generated<string>
  gifUrl: string
  id: Generated<number>
  sprintId: number
  templateId: number
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
  firstName: string
  id: Generated<number>
  lastName: string
  username: string
}

export interface DB {
  messages: Messages
  sprints: Sprints
  templates: Templates
  users: Users
}
