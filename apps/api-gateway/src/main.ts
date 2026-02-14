import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './infrastructure/http/module/api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './infrastructure/filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
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
