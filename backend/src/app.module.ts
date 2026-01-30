import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';
import { validate } from './config/validation.schema.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database';
import { AuthModule } from './modules/auth';
import { MarketDataModule } from './modules/market-data';
import { TechnicalAnalysisModule } from './modules/technical-analysis';
import { LLMAnalysisModule } from './modules/llm-analysis';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { AlertsModule } from './modules/alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    DatabaseModule,

    // Authentication
    AuthModule,

    // Market data
    MarketDataModule,

    // Technical Analysis
    TechnicalAnalysisModule,

    // LLM Analysis (Claude)
    LLMAnalysisModule,

    WebSocketModule,

    AlertsModule,

    // rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // task scheduling (for opportunity scanning alerts)
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
