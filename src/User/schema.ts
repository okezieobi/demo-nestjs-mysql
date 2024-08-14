import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './table';

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
