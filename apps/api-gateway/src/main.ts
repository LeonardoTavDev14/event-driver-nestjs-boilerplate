import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './infrastructure/http/module/api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());
  const PORT = process.env.PORT;
  await app.listen(PORT ?? 3000);
  console.log(`Server is running on port: ${PORT}`);
}
bootstrap();
