import { Module } from '@nestjs/common';
import { TechnicalAnalysisController } from './technical-analysis.controller.js';
import { TechnicalAnalysisService } from './technical-analysis.service.js';
import { IndicatorsService } from './indicators/indicators.service.js';
import { MarketDataModule } from '../market-data/market-data.module.js';

@Module({
  imports: [MarketDataModule],
  controllers: [TechnicalAnalysisController],
  providers: [TechnicalAnalysisService, IndicatorsService],
  exports: [TechnicalAnalysisService, IndicatorsService],
})
export class TechnicalAnalysisModule {}
