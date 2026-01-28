import { ApiProperty } from '@nestjs/swagger';

export class ConfidenceDto {
  @ApiProperty({ example: 8 })
  score: number;

  @ApiProperty({ example: 'HIGH' })
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

  @ApiProperty({
    example: ['Strong trend alignment', 'Multiple timeframe confluence'],
  })
  factors: string[];
}

export class EntryDto {
  @ApiProperty({ example: 'LIMIT' })
  type: 'MARKET' | 'LIMIT' | 'STOP';

  @ApiProperty({ example: 89250.0 })
  price: number;

  @ApiProperty({ example: 'Enter on pullback to EMA21' })
  trigger: string;
}

export class StopLossDto {
  @ApiProperty({ example: 88500.0 })
  price: number;

  @ApiProperty({ example: 0.84 })
  distancePercent: number;

  @ApiProperty({ example: 1.5 })
  atrMultiple: number;

  @ApiProperty({ example: 'Below recent swing low and SMA50' })
  placementLogic: string;
}

export class TakeProfitTargetDto {
  @ApiProperty({ example: 1 })
  level: number;

  @ApiProperty({ example: 90500.0 })
  price: number;

  @ApiProperty({ example: 50 })
  sizePercent: number;

  @ApiProperty({ example: 1.5 })
  rMultiple: number;
}

export class TakeProfitDto {
  @ApiProperty({ type: [TakeProfitTargetDto] })
  targets: TakeProfitTargetDto[];
}

export class RiskRewardDto {
  @ApiProperty({ example: '1:1.5' })
  toTp1: string;

  @ApiProperty({ example: '1:2.5' })
  toTp2: string;

  @ApiProperty({ example: '1:4.0' })
  toTp3: string;

  @ApiProperty({ example: '1:2.2' })
  weightedAverage: string;
}

export class PositionSizingDto {
  @ApiProperty({ example: 1 })
  recommendedRiskPercent: number;

  @ApiProperty({ example: 0.011 })
  positionSize: number;

  @ApiProperty({ example: '$100 risk on $10,000 account' })
  calculation: string;
}

export class TradeManagementDto {
  @ApiProperty({ example: 'Move stop to breakeven at 1R profit' })
  breakevenRule: string;

  @ApiProperty({ example: 'Trail stop 1.5 ATR below price after TP1' })
  trailingStop: string;

  @ApiProperty({ example: 'Price closes below EMA21 on 4H' })
  invalidation: string;
}

export class TradeRecommendationDto {
  @ApiProperty({ example: 'ATLAS-20260128-001' })
  recommendationId: string;

  @ApiProperty({ example: '2026-01-28T12:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'BTC/USDT' })
  symbol: string;

  @ApiProperty({ example: 'CRYPTO' })
  assetClass: string;

  @ApiProperty({ example: 'LONG' })
  direction: 'LONG' | 'SHORT' | 'NO_TRADE';

  @ApiProperty({ type: ConfidenceDto })
  confidence: ConfidenceDto;

  @ApiProperty({ example: 'SWING' })
  tradingStyle: string;

  @ApiProperty({ type: EntryDto })
  entry: EntryDto;

  @ApiProperty({ type: StopLossDto })
  stopLoss: StopLossDto;

  @ApiProperty({ type: TakeProfitDto })
  takeProfit: TakeProfitDto;

  @ApiProperty({ type: RiskRewardDto })
  riskReward: RiskRewardDto;

  @ApiProperty({ type: PositionSizingDto })
  positionSizing: PositionSizingDto;

  @ApiProperty({ type: TradeManagementDto })
  tradeManagement: TradeManagementDto;

  @ApiProperty({
    example: 'BTC showing strong bullish momentum with multiple confluences...',
  })
  rationale: string;

  @ApiProperty({
    example: ['Fed announcement tomorrow', 'Weekend liquidity risk'],
  })
  risks: string[];

  @ApiProperty()
  disclaimer: string;
}
