import { Module } from '@nestjs/common';
import { WebSocketMarketGateway } from './websocket.gateway';
import { BinanceStreamService } from './binance-stream.service';
import { MarketDataModule } from '../market-data/market-data.module';

@Module({
  imports: [MarketDataModule],
  providers: [WebSocketMarketGateway, BinanceStreamService],
  exports: [WebSocketMarketGateway, BinanceStreamService],
})
export class WebSocketModule {}
