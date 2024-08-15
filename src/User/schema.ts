import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from '../tables';
import { z } from 'zod';

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users, {
  id: z.coerce.number().int(),
  name: (schema) => schema.name,
});
