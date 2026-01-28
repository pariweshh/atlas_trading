import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter, LoggingInterceptor } from './common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // get config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);
  const apiPrefix = configService.get<string>('apiPrefix', 'api/v1');
  const nodeEnv = configService.get<string>('node_env', 'development');

  // set global prefix
  app.setGlobalPrefix(apiPrefix);

  // enable cors
  app.enableCors({
    origin:
      nodeEnv === 'production'
        ? ['https://yourdomain.com'] // Update with your frontend domain
        : [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
          ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation (only in development)
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('AI Trading Agent API')
      .setDescription(
        'Institutional-grade AI-powered trading analysis API for forex, crypto, and ETFs',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Health', 'Health check endpoints')
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Market Data', 'Real-time and historical market data')
      .addTag('Analysis', 'AI-powered trade analysis')
      .addTag('Alerts', 'Trading alerts and notifications')
      .addTag('Backtesting', 'Strategy backtesting')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`Swagger docs available at http://localhost:${port}/docs`);
  }

  await app.listen(port);

  logger.log(`Environment: ${nodeEnv}`);
  logger.log(`Application running on http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
