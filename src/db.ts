import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

export const dbConfig = {
  host: 'localhost',
  user: 'mysqladmin',
  database: 'mysql',
  password: '12345678',
  mode: 'mysql2',
};

const connection = mysql.createPool(dbConfig);

export const db = drizzle(connection);
