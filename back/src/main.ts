import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fs from 'fs';
import dotenv from 'dotenv';
import { NestApplicationOptions } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  let nestFactoryOptions: NestApplicationOptions = {
    bodyParser: false,
  };

  if (process.env.HTTPS_ENABLED == 'true') {
    if (!process.env.HTTPS_KEY_PATH || !process.env.HTTPS_CERT_PATH) {
      throw new Error(
        'HTTPS is enabled but HTTPS_KEY_PATH or HTTPS_CERT_PATH is not set in environment variables.',
      );
    }

    nestFactoryOptions = {
      ...nestFactoryOptions,
      httpsOptions: {
        key: fs.readFileSync(process.env.HTTPS_KEY_PATH),
        cert: fs.readFileSync(process.env.HTTPS_CERT_PATH),
      },
    };
  }

  console.log(`Starting server on port ${process.env.PORT ?? 3000}...`);
  console.log(`HTTPS enabled: ${process.env.HTTPS_ENABLED === 'true'}`);

  const app = await NestFactory.create(AppModule, nestFactoryOptions);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
