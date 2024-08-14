import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from './db';
import { insertUserSchema, selectUserSchema, users } from './User';

@Controller('users')
export class AppController {
  @Post()
  async insertUser(@Body() body: unknown) {
    try {
      const input = await insertUserSchema
        .pick({ name: true })
        .parseAsync(body);
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.name, input.name));
        if (user) {
          throw new HttpException(
            'User already exists',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        await db.insert(users).values(input);
        return HttpStatus.CREATED;
      } catch (error) {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    } catch (error) {
      throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Get()
  async listUsers() {
    try {
      const list = await db.select().from(users);
      return list;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    try {
      const input = await selectUserSchema
        .pick({ id: true })
        .parseAsync({ id });
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, input.id));
        if (user == null) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
      } catch (error) {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    } catch (error) {
      throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Patch(':id')
  async updateUser(@Param(':id') id: string, @Body() body: unknown) {
    try {
      const filter = await selectUserSchema
        .pick({ id: true })
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
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        await db
          .update(users)
          .set({ name: input.name })
          .where(eq(users.id, filter.id));
        return HttpStatus.OK;
      } catch (error) {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    } catch (error) {
      throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Delete(':id')
  async deleteUser(@Param(':id') id: string) {
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
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        await db.delete(users).where(eq(users.id, filter.id));
        return HttpStatus.OK;
      } catch (error) {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    } catch (error) {
      throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }
}
