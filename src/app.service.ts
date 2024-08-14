import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  create(arg: unknown) {
    return arg;
  }

  async insertUser(arg: unknown) {}
}
