import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTickerDto {
  @ApiProperty({
    example: 'EUR/USD',
    description: 'Trading symbol',
  })
  @IsString()
  symbol: string;
}

export class TickerResponseDto {
  @ApiProperty({ example: 'EUR/USD' })
  symbol: string;

  @ApiProperty({ example: 1.0855 })
  bid: number;

  @ApiProperty({ example: 1.0857 })
  ask: number;

  @ApiProperty({ example: 1.0856 })
  last: number;

  @ApiProperty({ example: 125000000 })
  volume24h: number;

  @ApiProperty({ example: 0.0023 })
  change24h: number;

  @ApiProperty({ example: 0.21 })
  changePercent24h: number;

  @ApiProperty({ example: '2026-01-27T12:00:00.000Z' })
  timestamp: Date;
}

export class MultipleTickersDto {
  @ApiProperty({
    example: ['EUR/USD', 'GBP/USD', 'BTC/USDT'],
    description: 'Array of trading symbols',
    isArray: true,
  })
  @IsString({ each: true })
  symbols: string[];
}
