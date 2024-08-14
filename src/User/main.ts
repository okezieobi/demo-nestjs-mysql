import { eq } from 'drizzle-orm';

import { db } from 'src/db';
import { insertUserSchema } from './schema';
import { User, users } from './table';

export class UserServices {
  protected errorHandlers: ((error: unknown) => void)[];
  constructor(...errorHandlers: ((error: unknown) => void)[]) {
    this.errorHandlers = errorHandlers;
  }

  async insert(arg: unknown) {
    const [validation, alreadyExists, unexpected] = this.errorHandlers;
    try {
      const input = await insertUserSchema.parseAsync(arg);
      try {
        const [user]: User[] = await db
          .select()
          .from(users)
          .where(eq(users.name, input.name));
        if (user) {
          throw alreadyExists(new Error('User already exists'));
        }
        return db.insert(users).values(input);
      } catch (error) {
        throw unexpected(error);
      }
    } catch (error) {
      throw validation(error);
    }
  }
}
