// database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

let db = null;

async function getDb() {
  if (db) {
    return db;
  }

  const dbPath = join(process.cwd(), 'database.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  return db;
}

export { getDb };