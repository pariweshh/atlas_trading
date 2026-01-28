import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { TimeframeType } from '../../market-data/dto/ohlcv.dto.js';
import { TIMEFRAMES } from '../../market-data/dto/ohlcv.dto.js';

export const TRADING_STYLES = [
  'SCALPING',
  'DAY_TRADING',
  'SWING',
  'POSITION',
] as const;
export type TradingStyleType = (typeof TRADING_STYLES)[number];

export class LLMAnalysisRequestDto {
  @ApiProperty({
    example: 'BTC/USDT',
    description: 'Trading symbol',
  })
  @IsString()
  symbol: string;

  @ApiProperty({
    example: '1h',
    description: 'Candle timeframe',
    enum: TIMEFRAMES,
  })
  @IsEnum(TIMEFRAMES, { message: 'Invalid timeframe' })
  timeframe: TimeframeType;

  @ApiProperty({
    example: 'SWING',
    description: 'Trading style',
    enum: TRADING_STYLES,
    default: 'SWING',
  })
  @IsOptional()
  @IsEnum(TRADING_STYLES, { message: 'Invalid trading style' })
  tradingStyle?: TradingStyleType = 'SWING';

  @ApiProperty({
    example: 10000,
    description: 'Account size for position sizing calculations',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  accountSize?: number;

  @ApiProperty({
    example: 1,
    description: 'Risk percentage per trade (1-3%)',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(3)
  riskPercent?: number = 1;

  @ApiProperty({
    example: 'Should I enter a long position here?',
    description: 'Specific question for the AI analyst',
    required: false,
  })
  @IsOptional()
  @IsString()
  specificQuestion?: string;
}
