import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
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

@Controller('users')
export class AppController {
  @Post()
  async insertUser(@Body() body: unknown) {
    try {
      const input = await insertUserSchema
        .pick({ name: true })
        .required()
        .parseAsync(body);
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.name, input.name));
        if (user) {
          return new ConflictException('User already exists');
        }
        await db.insert(users).values(input);
        return HttpStatus.CREATED;
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    } catch (error) {
      throw new BadRequestException(error);
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
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, input.id));
        if (user == null) {
          return new NotFoundException('User not found');
        }
        return user;
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    } catch (error) {
      throw new BadRequestException(error);
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
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, filter.id));
        if (user == null) {
          return new NotFoundException('User not found');
        }
        if (input.name != null) {
          await db
            .update(users)
            .set({ name: input.name })
            .where(eq(users.id, filter.id));
        }
        return HttpStatus.OK;
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const filter = await selectUserSchema
        .pick({ id: true })
        .parseAsync({ id });
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, filter.id));
        if (user == null) {
          return new NotFoundException('user not found');
        }
        await db.delete(users).where(eq(users.id, filter.id));
        return HttpStatus.OK;
      } catch (error) {
        throw new IntersectionObserver(error);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
