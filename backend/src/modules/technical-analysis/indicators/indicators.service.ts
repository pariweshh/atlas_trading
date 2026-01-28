import { Injectable } from '@nestjs/common';
import {
  RSI,
  MACD,
  SMA,
  EMA,
  BollingerBands,
  Stochastic,
  ATR,
} from 'technicalindicators';
import { OHLCV } from '../../market-data/interfaces/market-data.interface.js';

export interface RSIResult {
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  interpretation: string;
}

export interface MACDResult {
  macdLine: number;
  signalLine: number;
  histogram: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  interpretation: string;
}

export interface MovingAveragesResult {
  sma20: number;
  sma50: number;
  sma200: number;
  ema9: number;
  ema21: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  interpretation: string;
}

export interface BollingerBandsResult {
  upper: number;
  middle: number;
  lower: number;
  percentB: number;
  bandwidth: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  interpretation: string;
}

export interface StochasticResult {
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  interpretation: string;
}

export interface ATRResult {
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  interpretation: string;
}

export interface SupportResistanceResult {
  supportLevels: number[];
  resistanceLevels: number[];
  nearestSupport: number;
  nearestResistance: number;
}

@Injectable()
export class IndicatorsService {
  calculateRSI(candles: OHLCV[], period: number = 14): RSIResult {
    const closes = candles.map((c) => c.close);
    const rsiValues = RSI.calculate({ values: closes, period });
    const value = rsiValues[rsiValues.length - 1] || 50;

    let signal: 'bullish' | 'bearish' | 'neutral';
    let interpretation: string;

    if (value >= 70) {
      signal = 'bearish';
      interpretation =
        'RSI indicates overbought conditions - potential reversal';
    } else if (value <= 30) {
      signal = 'bullish';
      interpretation = 'RSI indicates oversold conditions - potential bounce';
    } else if (value > 50) {
      signal = 'bullish';
      interpretation = 'RSI shows bullish momentum';
    } else if (value < 50) {
      signal = 'bearish';
      interpretation = 'RSI shows bearish momentum';
    } else {
      signal = 'neutral';
      interpretation = 'RSI is neutral';
    }

    return { value: Math.round(value * 100) / 100, signal, interpretation };
  }

  calculateMACD(
    candles: OHLCV[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
  ): MACDResult {
    const closes = candles.map((c) => c.close);
    const macdValues = MACD.calculate({
      values: closes,
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });

    const latest = macdValues[macdValues.length - 1];
    const previous = macdValues[macdValues.length - 2];

    const macdLine = latest?.MACD || 0;
    const signalLine = latest?.signal || 0;
    const histogram = latest?.histogram || 0;

    let signal: 'bullish' | 'bearish' | 'neutral';
    let interpretation: string;

    if (histogram > 0 && previous && histogram > previous.histogram!) {
      signal = 'bullish';
      interpretation = 'MACD histogram expanding bullish - strong momentum';
    } else if (histogram > 0) {
      signal = 'bullish';
      interpretation = 'MACD above signal line - bullish';
    } else if (histogram < 0 && previous && histogram < previous.histogram!) {
      signal = 'bearish';
      interpretation =
        'MACD histogram expanding bearish - strong downward momentum';
    } else if (histogram < 0) {
      signal = 'bearish';
      interpretation = 'MACD below signal line - bearish';
    } else {
      signal = 'neutral';
      interpretation = 'MACD is neutral';
    }

    return {
      macdLine: Math.round(macdLine * 100) / 100,
      signalLine: Math.round(signalLine * 100) / 100,
      histogram: Math.round(histogram * 100) / 100,
      signal,
      interpretation,
    };
  }

  calculateMovingAverages(candles: OHLCV[]): MovingAveragesResult {
    const closes = candles.map((c) => c.close);
    const currentPrice = closes[closes.length - 1];

    const sma20Values = SMA.calculate({ values: closes, period: 20 });
    const sma50Values = SMA.calculate({ values: closes, period: 50 });
    const sma200Values = SMA.calculate({ values: closes, period: 200 });
    const ema9Values = EMA.calculate({ values: closes, period: 9 });
    const ema21Values = EMA.calculate({ values: closes, period: 21 });

    const sma20 = sma20Values[sma20Values.length - 1] || 0;
    const sma50 = sma50Values[sma50Values.length - 1] || 0;
    const sma200 = sma200Values[sma200Values.length - 1] || 0;
    const ema9 = ema9Values[ema9Values.length - 1] || 0;
    const ema21 = ema21Values[ema21Values.length - 1] || 0;

    let bullishCount = 0;
    let bearishCount = 0;

    if (currentPrice > sma20) bullishCount++;
    else bearishCount++;
    if (currentPrice > sma50) bullishCount++;
    else bearishCount++;
    if (currentPrice > sma200) bullishCount++;
    else bearishCount++;
    if (ema9 > ema21) bullishCount++;
    else bearishCount++;

    let signal: 'bullish' | 'bearish' | 'neutral';
    let interpretation: string;

    if (bullishCount >= 3) {
      signal = 'bullish';
      interpretation = `Price above ${bullishCount} major MAs - bullish trend`;
    } else if (bearishCount >= 3) {
      signal = 'bearish';
      interpretation = `Price below ${bearishCount} major MAs - bearish trend`;
    } else {
      signal = 'neutral';
      interpretation = 'Mixed MA signals - consolidation';
    }

    return {
      sma20: Math.round(sma20 * 100) / 100,
      sma50: Math.round(sma50 * 100) / 100,
      sma200: Math.round(sma200 * 100) / 100,
      ema9: Math.round(ema9 * 100) / 100,
      ema21: Math.round(ema21 * 100) / 100,
      signal,
      interpretation,
    };
  }

  calculateBollingerBands(
    candles: OHLCV[],
    period: number = 20,
    stdDev: number = 2,
  ): BollingerBandsResult {
    const closes = candles.map((c) => c.close);
    const currentPrice = closes[closes.length - 1];

    const bbValues = BollingerBands.calculate({
      values: closes,
      period,
      stdDev,
    });

    const latest = bbValues[bbValues.length - 1];
    const upper = latest?.upper || 0;
    const middle = latest?.middle || 0;
    const lower = latest?.lower || 0;

    const percentB =
      upper !== lower ? (currentPrice - lower) / (upper - lower) : 0.5;
    const bandwidth = middle !== 0 ? (upper - lower) / middle : 0;

    let signal: 'bullish' | 'bearish' | 'neutral';
    let interpretation: string;

    if (currentPrice >= upper) {
      signal = 'bearish';
      interpretation = 'Price at upper band - potential overbought';
    } else if (currentPrice <= lower) {
      signal = 'bullish';
      interpretation = 'Price at lower band - potential oversold';
    } else if (percentB > 0.5) {
      signal = 'bullish';
      interpretation = 'Price in upper half of bands - bullish bias';
    } else {
      signal = 'bearish';
      interpretation = 'Price in lower half of bands - bearish bias';
    }

    return {
      upper: Math.round(upper * 100) / 100,
      middle: Math.round(middle * 100) / 100,
      lower: Math.round(lower * 100) / 100,
      percentB: Math.round(percentB * 1000) / 1000,
      bandwidth: Math.round(bandwidth * 10000) / 10000,
      signal,
      interpretation,
    };
  }

  calculateStochastic(
    candles: OHLCV[],
    period: number = 14,
    signalPeriod: number = 3,
  ): StochasticResult {
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const closes = candles.map((c) => c.close);

    const stochValues = Stochastic.calculate({
      high: highs,
      low: lows,
      close: closes,
      period,
      signalPeriod,
    });

    const latest = stochValues[stochValues.length - 1];
    const value = latest?.k || 50;

    let signal: 'bullish' | 'bearish' | 'neutral';
    let interpretation: string;

    if (value >= 80) {
      signal = 'bearish';
      interpretation = 'Stochastic overbought - potential reversal';
    } else if (value <= 20) {
      signal = 'bullish';
      interpretation = 'Stochastic oversold - potential bounce';
    } else if (value > 50) {
      signal = 'bullish';
      interpretation = 'Stochastic showing bullish momentum';
    } else {
      signal = 'bearish';
      interpretation = 'Stochastic showing bearish momentum';
    }

    return {
      value: Math.round(value * 100) / 100,
      signal,
      interpretation,
    };
  }

  calculateATR(candles: OHLCV[], period: number = 14): ATRResult {
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const closes = candles.map((c) => c.close);

    const atrValues = ATR.calculate({
      high: highs,
      low: lows,
      close: closes,
      period,
    });

    const value = atrValues[atrValues.length - 1] || 0;
    const currentPrice = closes[closes.length - 1];
    const atrPercent = (value / currentPrice) * 100;

    let signal: 'bullish' | 'bearish' | 'neutral';
    let interpretation: string;

    if (atrPercent > 3) {
      signal = 'neutral';
      interpretation = 'High volatility - use wider stops';
    } else if (atrPercent > 1.5) {
      signal = 'neutral';
      interpretation = 'Moderate volatility - normal conditions';
    } else {
      signal = 'neutral';
      interpretation = 'Low volatility - potential breakout brewing';
    }

    return {
      value: Math.round(value * 100) / 100,
      signal,
      interpretation,
    };
  }

  calculateSupportResistance(candles: OHLCV[]): SupportResistanceResult {
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const currentPrice = candles[candles.length - 1].close;

    // Find pivot points using local maxima and minima
    const resistanceLevels: number[] = [];
    const supportLevels: number[] = [];

    for (let i = 2; i < candles.length - 2; i++) {
      // Local maximum (resistance)
      if (
        highs[i] > highs[i - 1] &&
        highs[i] > highs[i - 2] &&
        highs[i] > highs[i + 1] &&
        highs[i] > highs[i + 2]
      ) {
        resistanceLevels.push(highs[i]);
      }

      // Local minimum (support)
      if (
        lows[i] < lows[i - 1] &&
        lows[i] < lows[i - 2] &&
        lows[i] < lows[i + 1] &&
        lows[i] < lows[i + 2]
      ) {
        supportLevels.push(lows[i]);
      }
    }

    // Sort and remove duplicates (within 0.5% range)
    const filterLevels = (levels: number[]): number[] => {
      const sorted = [...new Set(levels)].sort((a, b) => a - b);
      const filtered: number[] = [];

      for (const level of sorted) {
        const isDuplicate = filtered.some(
          (f) => Math.abs(f - level) / level < 0.005,
        );
        if (!isDuplicate) {
          filtered.push(Math.round(level * 100) / 100);
        }
      }

      return filtered;
    };

    const filteredResistance = filterLevels(resistanceLevels)
      .filter((r) => r > currentPrice)
      .slice(0, 3);

    const filteredSupport = filterLevels(supportLevels)
      .filter((s) => s < currentPrice)
      .reverse()
      .slice(0, 3);

    return {
      supportLevels: filteredSupport,
      resistanceLevels: filteredResistance,
      nearestSupport: filteredSupport[0] || 0,
      nearestResistance: filteredResistance[0] || 0,
    };
  }
}
