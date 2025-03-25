
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'simplified' | 'guest';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  notificationPreference: 'email' | 'telegram';
  telegramId?: string;
  children?: number[]; // For parent role - child IDs
  school?: string;
  grade?: number;
  location?: string;
  groups?: number[];
}
