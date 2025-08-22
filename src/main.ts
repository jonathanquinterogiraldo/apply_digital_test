import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const forbiddenProps = errors
          .filter((e) => e.constraints?.['whitelistValidation'])
          .map((e) => e.property);

        if (forbiddenProps.includes('price')) {
          return new BadRequestException(
            `Property 'price' is not allowed. Use 'minPrice and 'maxPrice' for price range instead.`,
          );
        }

        return new BadRequestException(errors);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error starting server', err);
  process.exit(1);
});
