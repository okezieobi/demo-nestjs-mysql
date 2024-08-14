import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';

export const dbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'mysql',
  password: '12345678',
};

const connection = mysql.createPool(dbConfig);

export const db = drizzle(connection);
