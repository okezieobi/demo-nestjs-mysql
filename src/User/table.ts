import { mysqlTable, text, serial } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').unique(),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
