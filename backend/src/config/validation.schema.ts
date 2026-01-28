import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  // Application
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  API_PREFIX: string = 'api/v1';

  // Database (Required)
  @IsString()
  @IsNotEmpty({ message: 'DATABASE_URL is required' })
  DATABASE_URL: string;

  // Redis
  @IsString()
  @IsOptional()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  // JWT (Required)
  @IsString()
  @IsNotEmpty({ message: 'JWT_SECRET is required' })
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRATION: string = '7d';

  // Anthropic (Required for AI analysis)
  @IsString()
  @IsNotEmpty({ message: 'ANTHROPIC_API_KEY is required' })
  ANTHROPIC_API_KEY: string;

  // Market Data Providers (Optional at startup, required when used)
  @IsString()
  @IsOptional()
  OANDA_API_KEY?: string;

  @IsString()
  @IsOptional()
  OANDA_ACCOUNT_ID?: string;

  @IsString()
  @IsOptional()
  OANDA_ENVIRONMENT?: string;

  @IsString()
  @IsOptional()
  BINANCE_API_KEY?: string;

  @IsString()
  @IsOptional()
  BINANCE_API_SECRET?: string;

  @IsString()
  @IsOptional()
  POLYGON_API_KEY?: string;

  @IsString()
  @IsOptional()
  FINNHUB_API_KEY?: string;

  @IsString()
  @IsOptional()
  ALPHA_VANTAGE_API_KEY?: string;

  // Throttling
  @IsNumber()
  @IsOptional()
  THROTTLE_TTL: number = 60000;

  @IsNumber()
  @IsOptional()
  THROTTLE_LIMIT: number = 100;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : 'Unknown error';
        return `${error.property}: ${constraints}`;
      })
      .join('\n');

    throw new Error(`Environment validation failed:\n${errorMessages}`);
  }

  return validatedConfig;
}
