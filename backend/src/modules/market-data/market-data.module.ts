import { Module } from '@nestjs/common';
import { MarketDataController } from './market-data.controller.js';
import { MarketDataService } from './market-data.service.js';
import { BinanceProvider } from './providers/binance.provider.js';
import { OandaProvider } from './providers/oanda.provider.js';
import { PolygonProvider } from './providers/polygon.provider.js';

@Module({
  controllers: [MarketDataController],
  providers: [
    MarketDataService,
    BinanceProvider,
    OandaProvider,
    PolygonProvider,
  ],
  exports: [MarketDataService],
})
export class MarketDataModule {}
