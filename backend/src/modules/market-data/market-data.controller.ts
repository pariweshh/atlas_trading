import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { MarketDataService } from './market-data.service.js';
import {
  GetOHLCVDto,
  OHLCVResponseDto,
  TickerResponseDto,
  TIMEFRAMES,
} from './dto/index.js';
import { Timeframe } from './interfaces/market-data.interface.js';

@ApiTags('Market Data')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('ohlcv')
  @ApiOperation({ summary: 'Get OHLCV candlestick data' })
  @ApiQuery({
    name: 'symbol',
    example: 'BTC/USDT',
    description: 'Trading symbol',
  })
  @ApiQuery({
    name: 'timeframe',
    enum: TIMEFRAMES,
    example: '1h',
    description: 'Candle timeframe',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 100,
    description: 'Number of candles',
  })
  @ApiQuery({
    name: 'assetClass',
    required: false,
    enum: ['FOREX', 'CRYPTO', 'ETF'],
    description: 'Asset class (auto-detected if not provided)',
  })
  @ApiResponse({
    status: 200,
    description: 'OHLCV data retrieved successfully',
    type: [OHLCVResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOHLCV(
    @Query() query: GetOHLCVDto,
    @Query('assetClass') assetClass?: 'FOREX' | 'CRYPTO' | 'ETF',
  ): Promise<OHLCVResponseDto[]> {
    const data = await this.marketDataService.getOHLCV(
      query.symbol,
      query.timeframe as Timeframe,
      query.limit,
      assetClass,
    );

    return data;
  }

  @Get('ticker')
  @ApiOperation({ summary: 'Get current ticker price' })
  @ApiQuery({
    name: 'symbol',
    example: 'BTC/USDT',
    description: 'Trading symbol',
  })
  @ApiQuery({
    name: 'assetClass',
    required: false,
    enum: ['FOREX', 'CRYPTO', 'ETF'],
    description: 'Asset class (auto-detected if not provided)',
  })
  @ApiResponse({
    status: 200,
    description: 'Ticker data retrieved successfully',
    type: TickerResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTicker(
    @Query('symbol') symbol: string,
    @Query('assetClass') assetClass?: 'FOREX' | 'CRYPTO' | 'ETF',
  ): Promise<TickerResponseDto> {
    return this.marketDataService.getTicker(symbol, assetClass);
  }

  @Get('tickers')
  @ApiOperation({ summary: 'Get multiple ticker prices' })
  @ApiQuery({
    name: 'symbols',
    example: 'BTC/USDT,ETH/USDT',
    description: 'Comma-separated trading symbols',
  })
  @ApiQuery({
    name: 'assetClass',
    required: false,
    enum: ['FOREX', 'CRYPTO', 'ETF'],
    description: 'Asset class (auto-detected if not provided)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tickers data retrieved successfully',
    type: [TickerResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMultipleTickers(
    @Query('symbols') symbols: string,
    @Query('assetClass') assetClass?: 'FOREX' | 'CRYPTO' | 'ETF',
  ): Promise<TickerResponseDto[]> {
    const symbolList = symbols.split(',').map((s) => s.trim());
    return this.marketDataService.getMultipleTickers(symbolList, assetClass);
  }

  @Get('symbols/:assetClass')
  @ApiOperation({ summary: 'Get available symbols for an asset class' })
  @ApiResponse({
    status: 200,
    description: 'Available symbols retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAvailableSymbols(
    @Param('assetClass') assetClass: 'FOREX' | 'CRYPTO' | 'ETF',
  ) {
    return this.marketDataService.getAvailableSymbols(assetClass);
  }

  @Get('symbols')
  @ApiOperation({ summary: 'Get all available symbols from all providers' })
  @ApiResponse({
    status: 200,
    description: 'All available symbols retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllAvailableSymbols() {
    return this.marketDataService.getAllAvailableSymbols();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check health of all market data providers' })
  @ApiResponse({
    status: 200,
    description: 'Provider health status',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkProvidersHealth() {
    return this.marketDataService.checkProvidersHealth();
  }
}
