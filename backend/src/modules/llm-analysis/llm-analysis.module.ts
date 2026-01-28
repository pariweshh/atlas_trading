import { Module } from '@nestjs/common';
import { LLMAnalysisController } from './llm-analysis.controller.js';
import { LLMAnalysisService } from './llm-analysis.service.js';
import { MarketDataModule } from '../market-data/market-data.module.js';
import { TechnicalAnalysisModule } from '../technical-analysis/technical-analysis.module.js';

@Module({
  imports: [MarketDataModule, TechnicalAnalysisModule],
  controllers: [LLMAnalysisController],
  providers: [LLMAnalysisService],
  exports: [LLMAnalysisService],
})
export class LLMAnalysisModule {}
