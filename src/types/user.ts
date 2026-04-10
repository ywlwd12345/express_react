export const UserRole = {
  GUEST: 'guest',
  MEMBER: 'member',
  ADMIN: 'admin'
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

export const UserLevel = {
  NORMAL: 1,
  GOLD: 2,
  DIAMOND: 3
} as const

export type UserLevel = typeof UserLevel[keyof typeof UserLevel]

export interface User {
  id?: number;
  nickname: string;
  role: UserRole;
  level: UserLevel;
  created_at?: string;
}
