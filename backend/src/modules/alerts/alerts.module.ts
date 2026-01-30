import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { DatabaseModule } from '../../database/database.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { MarketDataModule } from '../market-data/market-data.module';
import { TechnicalAnalysisModule } from '../technical-analysis/technical-analysis.module';

@Module({
  imports: [
    DatabaseModule,
    WebSocketModule,
    MarketDataModule,
    TechnicalAnalysisModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
