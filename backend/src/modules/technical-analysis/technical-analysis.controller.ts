import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TechnicalAnalysisService } from './technical-analysis.service.js';
import {
  TechnicalAnalysisRequestDto,
  TechnicalAnalysisResponseDto,
} from './dto/analysis.dto.js';
import { Timeframe } from '../market-data/interfaces/market-data.interface.js';

@ApiTags('Analysis')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('analysis/technical')
export class TechnicalAnalysisController {
  constructor(
    private readonly technicalAnalysisService: TechnicalAnalysisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get full technical analysis for a symbol' })
  @ApiResponse({
    status: 200,
    description: 'Technical analysis completed successfully',
    type: TechnicalAnalysisResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async analyze(
    @Query() query: TechnicalAnalysisRequestDto,
  ): Promise<TechnicalAnalysisResponseDto> {
    return this.technicalAnalysisService.analyze(
      query.symbol,
      query.timeframe as Timeframe,
      query.limit,
    );
  }

  @Get('quick-scan')
  @ApiOperation({
    summary: 'Quick scan to check if a symbol has a trading setup',
  })
  @ApiResponse({
    status: 200,
    description: 'Quick scan completed',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async quickScan(
    @Query('symbol') symbol: string,
  ): Promise<{ hasSetup: boolean; direction: string }> {
    return this.technicalAnalysisService.quickScan(symbol);
  }
}
