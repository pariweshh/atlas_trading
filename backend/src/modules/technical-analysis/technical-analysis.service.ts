import { Injectable, Logger } from '@nestjs/common';
import { MarketDataService } from '../market-data/market-data.service.js';
import { IndicatorsService } from './indicators/indicators.service.js';
import { Timeframe } from '../market-data/interfaces/market-data.interface.js';
import { TechnicalAnalysisResponseDto } from './dto/analysis.dto.js';

@Injectable()
export class TechnicalAnalysisService {
  private readonly logger = new Logger(TechnicalAnalysisService.name);

  constructor(
    private readonly marketDataService: MarketDataService,
    private readonly indicatorsService: IndicatorsService,
  ) {}

  async analyze(
    symbol: string,
    timeframe: Timeframe,
    limit: number = 100,
  ): Promise<TechnicalAnalysisResponseDto> {
    this.logger.debug(`Analyzing ${symbol} on ${timeframe} timeframe`);

    // Fetch OHLCV data
    const candles = await this.marketDataService.getOHLCV(
      symbol,
      timeframe,
      Math.max(limit, 200), // Need at least 200 for SMA200
    );

    if (candles.length < 50) {
      throw new Error(
        `Insufficient data for analysis. Got ${candles.length} candles, need at least 50.`,
      );
    }

    const currentPrice = candles[candles.length - 1].close;

    // Calculate all indicators
    const rsi = this.indicatorsService.calculateRSI(candles);
    const macd = this.indicatorsService.calculateMACD(candles);
    const movingAverages =
      this.indicatorsService.calculateMovingAverages(candles);
    const bollingerBands =
      this.indicatorsService.calculateBollingerBands(candles);
    const stochastic = this.indicatorsService.calculateStochastic(candles);
    const atr = this.indicatorsService.calculateATR(candles);
    const supportResistance =
      this.indicatorsService.calculateSupportResistance(candles);

    // Calculate overall trend and signal strength
    const { overallTrend, signalStrength } = this.calculateOverallTrend({
      rsi,
      macd,
      movingAverages,
      bollingerBands,
      stochastic,
    });

    return {
      symbol,
      timeframe,
      currentPrice: Math.round(currentPrice * 100) / 100,
      overallTrend,
      signalStrength,
      rsi,
      macd,
      movingAverages,
      bollingerBands,
      stochastic,
      atr,
      supportResistance,
      timestamp: new Date(),
    };
  }

  private calculateOverallTrend(indicators: {
    rsi: { signal: string };
    macd: { signal: string };
    movingAverages: { signal: string };
    bollingerBands: { signal: string };
    stochastic: { signal: string };
  }): {
    overallTrend: 'bullish' | 'bearish' | 'neutral';
    signalStrength: number;
  } {
    const signals = [
      indicators.rsi.signal,
      indicators.macd.signal,
      indicators.movingAverages.signal,
      indicators.bollingerBands.signal,
      indicators.stochastic.signal,
    ];

    let bullishCount = 0;
    let bearishCount = 0;

    for (const signal of signals) {
      if (signal === 'bullish') bullishCount++;
      else if (signal === 'bearish') bearishCount++;
    }

    const totalSignals = signals.length;
    let overallTrend: 'bullish' | 'bearish' | 'neutral';
    let signalStrength: number;

    if (bullishCount >= 4) {
      overallTrend = 'bullish';
      signalStrength = Math.round((bullishCount / totalSignals) * 10);
    } else if (bearishCount >= 4) {
      overallTrend = 'bearish';
      signalStrength = Math.round((bearishCount / totalSignals) * 10);
    } else if (bullishCount >= 3) {
      overallTrend = 'bullish';
      signalStrength = Math.round((bullishCount / totalSignals) * 10);
    } else if (bearishCount >= 3) {
      overallTrend = 'bearish';
      signalStrength = Math.round((bearishCount / totalSignals) * 10);
    } else {
      overallTrend = 'neutral';
      signalStrength = 5;
    }

    return { overallTrend, signalStrength };
  }

  async quickScan(
    symbol: string,
  ): Promise<{ hasSetup: boolean; direction: string }> {
    try {
      const analysis = await this.analyze(symbol, '1h', 100);

      const hasSetup =
        analysis.signalStrength >= 7 && analysis.overallTrend !== 'neutral';

      return {
        hasSetup,
        direction: analysis.overallTrend,
      };
    } catch (error) {
      this.logger.warn(`Quick scan failed for ${symbol}: ${error}`);
      return { hasSetup: false, direction: 'neutral' };
    }
  }
}
