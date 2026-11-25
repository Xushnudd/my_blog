import { hashPassword } from "@/utils/hash";
import { pool } from "./db";

export type User = {
  id: number;
  fullname: string;
  username: string;
  hashed_password: string;
  role: string;
}

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullname TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      hashed_password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);
}

createTable();

export async function addUser(
  fullname: string,
  username: string,
  password: string,
  role: string = "user"
): Promise<User> {
  const res = await pool.query<User>(
    "INSERT INTO users (fullname, username, hashed_password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [fullname, username, hashPassword(password), role]
  );
  return res.rows[0]
}

export async function getUserByUsername(username: string) {
  const res = await pool.query<User>(
    "SELECT * FROM users WHERE username = $1",[username]
  );
  return res.rows[0] ?? null;
}