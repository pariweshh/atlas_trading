import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { MarketDataService } from '../market-data/market-data.service.js';
import { TechnicalAnalysisService } from '../technical-analysis/technical-analysis.service.js';
import { TechnicalAnalysisResponseDto } from '../technical-analysis/dto/analysis.dto.js';
import { Ticker } from '../market-data/interfaces/market-data.interface.js';
import {
  LLMAnalysisRequestDto,
  TradingStyleType,
} from './dto/analysis-request.dto.js';
import { TradeRecommendationDto } from './dto/trade-recommendation.dto.js';
import { Timeframe } from '../market-data/interfaces/market-data.interface.js';

interface ParsedConfidence {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  factors: string[];
}

interface ParsedEntry {
  type: 'MARKET' | 'LIMIT' | 'STOP';
  price: number;
  trigger: string;
}

interface ParsedStopLoss {
  price: number;
  distancePercent: number;
  atrMultiple: number;
  placementLogic: string;
}

interface ParsedTakeProfitTarget {
  level: number;
  price: number;
  sizePercent: number;
  rMultiple: number;
}

interface ParsedTakeProfit {
  targets: ParsedTakeProfitTarget[];
}

interface ParsedRiskReward {
  toTp1: string;
  toTp2: string;
  toTp3: string;
  weightedAverage: string;
}

interface ParsedTradeManagement {
  breakevenRule: string;
  trailingStop: string;
  invalidation: string;
}

interface ParsedRecommendation {
  direction: 'LONG' | 'SHORT' | 'NO_TRADE';
  confidence: ParsedConfidence;
  entry: ParsedEntry;
  stopLoss: ParsedStopLoss;
  takeProfit: ParsedTakeProfit;
  riskReward: ParsedRiskReward;
  tradeManagement: ParsedTradeManagement;
  rationale: string;
  risks: string[];
}

@Injectable()
export class LLMAnalysisService {
  private readonly logger = new Logger(LLMAnalysisService.name);
  private readonly anthropic: Anthropic;

  constructor(
    private readonly configService: ConfigService,
    private readonly marketDataService: MarketDataService,
    private readonly technicalAnalysisService: TechnicalAnalysisService,
  ) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('anthropic.apiKey'),
    });
  }

  async analyzeAndRecommend(
    request: LLMAnalysisRequestDto,
  ): Promise<TradeRecommendationDto> {
    this.logger.debug(`Generating AI analysis for ${request.symbol}`);

    // Get technical analysis
    const technicalAnalysis = await this.technicalAnalysisService.analyze(
      request.symbol,
      request.timeframe as Timeframe,
      200,
    );

    // Get current ticker
    const ticker = await this.marketDataService.getTicker(request.symbol);

    // Build the prompt
    const prompt = this.buildPrompt(request, technicalAnalysis, ticker);

    // Call Claude
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const recommendation = this.parseRecommendation(
      content.text,
      request,
      ticker.last,
    );

    return recommendation;
  }

  private buildPrompt(
    request: LLMAnalysisRequestDto,
    technicalAnalysis: TechnicalAnalysisResponseDto,
    ticker: Ticker,
  ): string {
    const riskParams = this.getRiskParameters(request.tradingStyle || 'SWING');

    return `You are ATLAS, an institutional-grade trading analyst. Analyze the following market data and provide a structured trade recommendation.

## ASSET INFORMATION
- Symbol: ${request.symbol}
- Current Price: ${ticker.last}
- 24h Change: ${ticker.changePercent24h}%
- 24h Volume: ${ticker.volume24h}

## TECHNICAL ANALYSIS
- Overall Trend: ${technicalAnalysis.overallTrend}
- Signal Strength: ${technicalAnalysis.signalStrength}/10

### RSI (14)
- Value: ${technicalAnalysis.rsi.value}
- Signal: ${technicalAnalysis.rsi.signal}
- Interpretation: ${technicalAnalysis.rsi.interpretation}

### MACD (12, 26, 9)
- MACD Line: ${technicalAnalysis.macd.macdLine}
- Signal Line: ${technicalAnalysis.macd.signalLine}
- Histogram: ${technicalAnalysis.macd.histogram}
- Signal: ${technicalAnalysis.macd.signal}
- Interpretation: ${technicalAnalysis.macd.interpretation}

### Moving Averages
- SMA20: ${technicalAnalysis.movingAverages.sma20}
- SMA50: ${technicalAnalysis.movingAverages.sma50}
- SMA200: ${technicalAnalysis.movingAverages.sma200}
- EMA9: ${technicalAnalysis.movingAverages.ema9}
- EMA21: ${technicalAnalysis.movingAverages.ema21}
- Signal: ${technicalAnalysis.movingAverages.signal}

### Bollinger Bands (20, 2)
- Upper: ${technicalAnalysis.bollingerBands.upper}
- Middle: ${technicalAnalysis.bollingerBands.middle}
- Lower: ${technicalAnalysis.bollingerBands.lower}
- %B: ${technicalAnalysis.bollingerBands.percentB}
- Signal: ${technicalAnalysis.bollingerBands.signal}

### Stochastic (14, 3)
- Value: ${technicalAnalysis.stochastic.value}
- Signal: ${technicalAnalysis.stochastic.signal}

### ATR (14)
- Value: ${technicalAnalysis.atr.value}

### Support & Resistance
- Support Levels: ${technicalAnalysis.supportResistance.supportLevels.join(', ')}
- Resistance Levels: ${technicalAnalysis.supportResistance.resistanceLevels.join(', ')}
- Nearest Support: ${technicalAnalysis.supportResistance.nearestSupport}
- Nearest Resistance: ${technicalAnalysis.supportResistance.nearestResistance}

## TRADING PARAMETERS
- Trading Style: ${request.tradingStyle}
- Account Size: ${request.accountSize ? `$${request.accountSize}` : 'Not specified'}
- Risk Per Trade: ${request.riskPercent}%
- Minimum R:R Required: ${riskParams.minRR}
- Maximum Stop Distance: ${riskParams.maxStopATR}x ATR

${request.specificQuestion ? `## SPECIFIC QUESTION\n${request.specificQuestion}` : ''}

## INSTRUCTIONS
Provide your analysis in the following JSON format. Be specific with price levels and ensure all calculations are mathematically correct.

\`\`\`json
{
  "direction": "LONG" | "SHORT" | "NO_TRADE",
  "confidence": {
    "score": <1-10>,
    "level": "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH",
    "factors": ["<reason1>", "<reason2>", ...]
  },
  "entry": {
    "type": "MARKET" | "LIMIT" | "STOP",
    "price": <number>,
    "trigger": "<condition for entry>"
  },
  "stopLoss": {
    "price": <number>,
    "distancePercent": <number>,
    "atrMultiple": <number>,
    "placementLogic": "<why this level>"
  },
  "takeProfit": {
    "targets": [
      { "level": 1, "price": <number>, "sizePercent": 50, "rMultiple": <number> },
      { "level": 2, "price": <number>, "sizePercent": 30, "rMultiple": <number> },
      { "level": 3, "price": <number>, "sizePercent": 20, "rMultiple": <number> }
    ]
  },
  "riskReward": {
    "toTp1": "<ratio>",
    "toTp2": "<ratio>",
    "toTp3": "<ratio>",
    "weightedAverage": "<ratio>"
  },
  "tradeManagement": {
    "breakevenRule": "<when to move stop to breakeven>",
    "trailingStop": "<trailing stop strategy>",
    "invalidation": "<conditions that invalidate the trade>"
  },
  "rationale": "<2-3 paragraph explanation of why this trade>",
  "risks": ["<risk1>", "<risk2>", ...]
}
\`\`\`

If the setup is not favorable, set direction to "NO_TRADE" and explain why in the rationale.

IMPORTANT: 
- All price levels must be realistic based on current price and ATR
- Stop loss must be at a logical technical level
- Risk:Reward must meet the minimum ${riskParams.minRR} requirement
- Be specific and actionable`;
  }

  private getRiskParameters(tradingStyle: TradingStyleType): {
    minRR: string;
    maxStopATR: number;
  } {
    const params: Record<
      TradingStyleType,
      { minRR: string; maxStopATR: number }
    > = {
      SCALPING: { minRR: '1:1.5', maxStopATR: 1 },
      DAY_TRADING: { minRR: '1:2', maxStopATR: 1.5 },
      SWING: { minRR: '1:2.5', maxStopATR: 2 },
      POSITION: { minRR: '1:3', maxStopATR: 3 },
    };
    return params[tradingStyle];
  }

  private parseRecommendation(
    responseText: string,
    request: LLMAnalysisRequestDto,
    currentPrice: number,
  ): TradeRecommendationDto {
    // Extract JSON from response
    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error('Failed to parse recommendation from Claude response');
    }

    const parsed = JSON.parse(jsonMatch[1]) as ParsedRecommendation;

    // Calculate position sizing if account size provided
    let positionSizing = {
      recommendedRiskPercent: request.riskPercent || 1,
      positionSize: 0,
      calculation: 'Account size not provided',
    };

    if (request.accountSize && parsed.stopLoss?.price) {
      const riskAmount =
        request.accountSize * ((request.riskPercent || 1) / 100);
      const stopDistance = Math.abs(currentPrice - parsed.stopLoss.price);
      const positionSize = stopDistance > 0 ? riskAmount / stopDistance : 0;

      positionSizing = {
        recommendedRiskPercent: request.riskPercent || 1,
        positionSize: Math.round(positionSize * 100000) / 100000,
        calculation: `$${riskAmount} risk / $${stopDistance.toFixed(2)} stop distance = ${positionSize.toFixed(5)} units`,
      };
    }

    const recommendationId = `ATLAS-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    return {
      recommendationId,
      timestamp: new Date().toISOString(),
      symbol: request.symbol,
      assetClass: this.detectAssetClass(request.symbol),
      direction: parsed.direction,
      confidence: parsed.confidence,
      tradingStyle: request.tradingStyle || 'SWING',
      entry: parsed.entry,
      stopLoss: parsed.stopLoss,
      takeProfit: parsed.takeProfit,
      riskReward: parsed.riskReward,
      positionSizing,
      tradeManagement: parsed.tradeManagement,
      rationale: parsed.rationale,
      risks: parsed.risks || [],
      disclaimer:
        '⚠️ DISCLAIMER: This analysis is for educational and informational purposes only. It does not constitute financial advice. Trading involves substantial risk of loss. Always conduct your own research and consult with a licensed financial advisor before making investment decisions. Never trade with money you cannot afford to lose.',
    };
  }

  private detectAssetClass(symbol: string): string {
    const upperSymbol = symbol.toUpperCase();

    if (upperSymbol.includes('USDT') || upperSymbol.includes('BTC')) {
      return 'CRYPTO';
    }

    const forexCurrencies = [
      'EUR',
      'USD',
      'GBP',
      'JPY',
      'AUD',
      'NZD',
      'CAD',
      'CHF',
    ];
    const parts = upperSymbol.split('/');
    if (
      parts.length === 2 &&
      forexCurrencies.includes(parts[0]) &&
      forexCurrencies.includes(parts[1])
    ) {
      return 'FOREX';
    }

    return 'ETF';
  }
}
