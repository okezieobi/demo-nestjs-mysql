import { Body, Controller, Get, Post } from '@nestjs/common';
import { z } from 'zod';

import { AppService } from './app.service';
import { ZodPipe } from './zod.pipe';

const schema = z.object({
  name: z.string(),
});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  post(@Body(new ZodPipe(schema)) body) {
    return this.appService.create(body);
  }
}
