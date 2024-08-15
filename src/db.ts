import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';

export const dbConfig = {
  database: 'dev',
  password: 'example',
  host: '127.0.0.1',
  user: 'root',
};

const connection = mysql.createPool(dbConfig);

export const db = drizzle(connection);
