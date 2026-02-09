import { query } from '../config/database';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  username: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserInsert {
  email: string;
  password_hash: string;
  username?: string | null;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const { rows } = await query<User>('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
}

export async function findUserById(id: number): Promise<User | undefined> {
  const { rows } = await query<User>('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

export async function createUser(data: UserInsert): Promise<number> {
  const { rows } = await query<{ id: number }>(
    'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id',
    [data.email, data.password_hash, data.username ?? null]
  );
  return rows[0].id;
}
