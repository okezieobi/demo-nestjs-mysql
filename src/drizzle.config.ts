import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './tables.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    password: 'example',
    database: 'dev',
    host: '127.0.0.1',
    user: 'root',
  },
});
