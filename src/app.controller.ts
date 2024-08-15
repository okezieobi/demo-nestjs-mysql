import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from './db';
import { insertUserSchema, selectUserSchema } from './User';
import { users } from './tables';
import { ZodError } from 'zod';

@Controller('users')
export class AppController {
  @Post()
  async insertUser(@Body() body: unknown) {
    try {
      const input = await insertUserSchema
        .pick({ name: true })
        .required()
        .parseAsync(body);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.name, input.name));
      if (user) {
        throw new ConflictException('User already exists');
      }
      await db.insert(users).values(input);
      const [newUser] = await db
        .select()
        .from(users)
        .where(eq(users.name, input.name));
      return newUser;
    } catch (error) {
      switch (true) {
        case error instanceof ZodError:
          throw new BadRequestException(error);
        default:
          throw error;
      }
    }
  }

  @Get()
  async listUsers() {
    try {
      const list = await db.select().from(users);
      return list;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    try {
      const input = await selectUserSchema
        .pick({ id: true })
        .required()
        .parseAsync({ id });
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id));
      if (user == null) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      switch (true) {
        case error instanceof ZodError:
          throw new BadRequestException(error);
        default:
          throw error;
      }
    }
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: unknown) {
    try {
      const filter = await selectUserSchema
        .pick({ id: true })
        .required()
        .parseAsync({ id });
      const input = await insertUserSchema
        .pick({ name: true })
        .parseAsync(body);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, filter.id));
      if (user == null) {
        throw new NotFoundException('User not found');
      }
      if (input.name != null) {
        await db
          .update(users)
          .set({ name: input.name })
          .where(eq(users.id, filter.id));
        const [updatedUser] = await db
          .select()
          .from(users)
          .where(eq(users.name, input.name));
        return updatedUser;
      }
      return user;
    } catch (error) {
      switch (true) {
        case error instanceof ZodError:
          throw new BadRequestException(error);
        default:
          throw error;
      }
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const filter = await selectUserSchema
        .pick({ id: true })
        .parseAsync({ id });
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, filter.id));
      if (user == null) {
        throw new NotFoundException('user not found');
      }
      await db.delete(users).where(eq(users.id, filter.id));
      return { message: 'User successfully deleted' };
    } catch (error) {
      switch (true) {
        case error instanceof ZodError:
          throw new BadRequestException(error);
        default:
          throw error;
      }
    }
  }
}
