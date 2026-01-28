import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TIMEFRAMES } from '../../market-data/dto/ohlcv.dto.js';
import type { TimeframeType } from '../../market-data/dto/ohlcv.dto.js';

export class TechnicalAnalysisRequestDto {
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
    example: 100,
    description: 'Number of candles to analyze',
    required: false,
    default: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(14)
  @Max(500)
  limit?: number = 100;
}

export class IndicatorValueDto {
  @ApiProperty({ example: 65.5 })
  value: number;

  @ApiProperty({ example: 'neutral' })
  signal: 'bullish' | 'bearish' | 'neutral';

  @ApiProperty({ example: 'RSI is in neutral territory', required: false })
  interpretation?: string;
}

export class MovingAveragesDto {
  @ApiProperty({ example: 42500.25 })
  sma20: number;

  @ApiProperty({ example: 41800.5 })
  sma50: number;

  @ApiProperty({ example: 40200.75 })
  sma200: number;

  @ApiProperty({ example: 42800.3 })
  ema9: number;

  @ApiProperty({ example: 42200.15 })
  ema21: number;

  @ApiProperty({ example: 'bullish' })
  signal: 'bullish' | 'bearish' | 'neutral';

  @ApiProperty({ example: 'Price above all major MAs' })
  interpretation: string;
}

export class MACDDto {
  @ApiProperty({ example: 150.25 })
  macdLine: number;

  @ApiProperty({ example: 120.5 })
  signalLine: number;

  @ApiProperty({ example: 29.75 })
  histogram: number;

  @ApiProperty({ example: 'bullish' })
  signal: 'bullish' | 'bearish' | 'neutral';

  @ApiProperty({ example: 'MACD above signal line' })
  interpretation: string;
}

export class BollingerBandsDto {
  @ApiProperty({ example: 44000.0 })
  upper: number;

  @ApiProperty({ example: 42000.0 })
  middle: number;

  @ApiProperty({ example: 40000.0 })
  lower: number;

  @ApiProperty({ example: 0.65 })
  percentB: number;

  @ApiProperty({ example: 0.045 })
  bandwidth: number;

  @ApiProperty({ example: 'neutral' })
  signal: 'bullish' | 'bearish' | 'neutral';

  @ApiProperty({ example: 'Price in upper half of bands' })
  interpretation: string;
}

export class SupportResistanceDto {
  @ApiProperty({ example: [41500, 40000, 38500] })
  supportLevels: number[];

  @ApiProperty({ example: [44000, 45500, 48000] })
  resistanceLevels: number[];

  @ApiProperty({ example: 41500 })
  nearestSupport: number;

  @ApiProperty({ example: 44000 })
  nearestResistance: number;
}

export class TechnicalAnalysisResponseDto {
  @ApiProperty({ example: 'BTC/USDT' })
  symbol: string;

  @ApiProperty({ example: '1h' })
  timeframe: string;

  @ApiProperty({ example: 42500.5 })
  currentPrice: number;

  @ApiProperty({ example: 'bullish' })
  overallTrend: 'bullish' | 'bearish' | 'neutral';

  @ApiProperty({ example: 7 })
  signalStrength: number;

  @ApiProperty({ type: IndicatorValueDto })
  rsi: IndicatorValueDto;

  @ApiProperty({ type: MACDDto })
  macd: MACDDto;

  @ApiProperty({ type: MovingAveragesDto })
  movingAverages: MovingAveragesDto;

  @ApiProperty({ type: BollingerBandsDto })
  bollingerBands: BollingerBandsDto;

  @ApiProperty({ type: IndicatorValueDto })
  stochastic: IndicatorValueDto;

  @ApiProperty({ type: IndicatorValueDto })
  atr: IndicatorValueDto;

  @ApiProperty({ type: SupportResistanceDto })
  supportResistance: SupportResistanceDto;

  @ApiProperty({ example: '2026-01-28T12:00:00.000Z' })
  timestamp: Date;
}
