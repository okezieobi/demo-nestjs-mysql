import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// import { dbConfig } from './db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // await mysql.createConnection(dbConfig);
}
bootstrap();
