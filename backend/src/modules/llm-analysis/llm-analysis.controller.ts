import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { LLMAnalysisService } from './llm-analysis.service.js';
import { LLMAnalysisRequestDto } from './dto/analysis-request.dto.js';
import { TradeRecommendationDto } from './dto/trade-recommendation.dto.js';

@ApiTags('Analysis')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('analysis/ai')
export class LLMAnalysisController {
  constructor(private readonly llmAnalysisService: LLMAnalysisService) {}

  @Post()
  @ApiOperation({ summary: 'Get AI-powered trade recommendation' })
  @ApiResponse({
    status: 200,
    description: 'AI analysis completed successfully',
    type: TradeRecommendationDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async analyze(
    @Body() request: LLMAnalysisRequestDto,
  ): Promise<TradeRecommendationDto> {
    return this.llmAnalysisService.analyzeAndRecommend(request);
  }
}
