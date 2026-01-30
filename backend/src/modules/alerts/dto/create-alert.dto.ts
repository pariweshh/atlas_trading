import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AlertType {
  PRICE_ABOVE = 'PRICE_ABOVE',
  PRICE_BELOW = 'PRICE_BELOW',
  PRICE_CROSS = 'PRICE_CROSS',
  RSI_OVERBOUGHT = 'RSI_OVERBOUGHT',
  RSI_OVERSOLD = 'RSI_OVERSOLD',
  MACD_BULLISH = 'MACD_BULLISH',
  MACD_BEARISH = 'MACD_BEARISH',
  AI_OPPORTUNITY = 'AI_OPPORTUNITY',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  TRIGGERED = 'TRIGGERED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export class CreateAlertDto {
  @ApiProperty({ example: 'BTC/USDT' })
  @IsString()
  symbol: string;

  @ApiProperty({ enum: AlertType, example: AlertType.PRICE_ABOVE })
  @IsEnum(AlertType)
  type: AlertType;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @IsNumber()
  targetPrice?: number;

  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  rsiThreshold?: number;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  minSignalStrength?: number;

  @ApiPropertyOptional({ example: '1h' })
  @IsOptional()
  @IsString()
  timeframe?: string;

  @ApiPropertyOptional({ example: 'Price target for BTC breakout' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  repeatAlert?: boolean;
}
