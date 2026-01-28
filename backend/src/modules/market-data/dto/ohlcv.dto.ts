import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const TIMEFRAMES = [
  '1m',
  '5m',
  '15m',
  '30m',
  '1h',
  '4h',
  '1d',
  '1w',
] as const;
export type TimeframeType = (typeof TIMEFRAMES)[number];

export class GetOHLCVDto {
  @ApiProperty({
    example: 'EUR/USD',
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
    description: 'Number of candles to fetch (max 1000)',
    required: false,
    default: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 100;
}

export class OHLCVResponseDto {
  @ApiProperty({ example: '2026-01-27T12:00:00.000Z' })
  timestamp: Date;

  @ApiProperty({ example: 1.085 })
  open: number;

  @ApiProperty({ example: 1.087 })
  high: number;

  @ApiProperty({ example: 1.083 })
  low: number;

  @ApiProperty({ example: 1.086 })
  close: number;

  @ApiProperty({ example: 15000 })
  volume: number;
}
