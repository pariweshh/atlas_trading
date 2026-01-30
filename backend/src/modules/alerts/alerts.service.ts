import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { CreateAlertDto, AlertStatus, AlertType } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { WebSocketMarketGateway } from '../websocket/websocket.gateway';
import { MarketDataService } from '../market-data/market-data.service';
import { TechnicalAnalysisService } from '../technical-analysis/technical-analysis.service';
import { Timeframe } from '../market-data/interfaces/market-data.interface';

interface AlertWithUser {
  id: string;
  userId: string;
  symbol: string;
  alertType: string;
  status: string;
  targetPrice: number | null;
  rsiThreshold: number | null;
  minSignalStrength: number | null;
  timeframe: string | null;
  note: string | null;
  repeatAlert: boolean;
  triggeredAt: Date | null;
  triggeredPrice: number | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
  };
}

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wsGateway: WebSocketMarketGateway,
    private readonly marketDataService: MarketDataService,
    private readonly technicalAnalysisService: TechnicalAnalysisService,
  ) {}

  async create(userId: string, dto: CreateAlertDto) {
    const alert = await this.prisma.alert.create({
      data: {
        userId,
        symbol: dto.symbol,
        alertType: dto.type,
        status: AlertStatus.ACTIVE,
        targetPrice: dto.targetPrice ?? null,
        rsiThreshold: dto.rsiThreshold ?? null,
        minSignalStrength: dto.minSignalStrength ?? null,
        timeframe: dto.timeframe ?? null,
        note: dto.note ?? null,
        repeatAlert: dto.repeatAlert ?? true,
      },
    });

    this.logger.log(`Alert created: ${alert.id} for ${dto.symbol}`);
    return this.mapAlertResponse(alert);
  }

  async findAllByUser(userId: string) {
    const alerts = await this.prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return alerts.map((alert) => this.mapAlertResponse(alert));
  }

  async findActiveByUser(userId: string) {
    const alerts = await this.prisma.alert.findMany({
      where: {
        userId,
        status: AlertStatus.ACTIVE,
      },
      orderBy: { createdAt: 'desc' },
    });
    return alerts.map((alert) => this.mapAlertResponse(alert));
  }

  async findOne(id: string, userId: string) {
    const alert = await this.prisma.alert.findFirst({
      where: { id, userId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    return this.mapAlertResponse(alert);
  }

  async update(id: string, userId: string, dto: UpdateAlertDto) {
    await this.findOne(id, userId);

    const alert = await this.prisma.alert.update({
      where: { id },
      data: {
        symbol: dto.symbol,
        alertType: dto.type,
        status: dto.status,
        targetPrice: dto.targetPrice,
        rsiThreshold: dto.rsiThreshold,
        minSignalStrength: dto.minSignalStrength,
        timeframe: dto.timeframe,
        note: dto.note,
        repeatAlert: dto.repeatAlert,
      },
    });

    return this.mapAlertResponse(alert);
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.alert.delete({
      where: { id },
    });

    return { message: 'Alert deleted successfully' };
  }

  async cancelAlert(id: string, userId: string) {
    await this.findOne(id, userId);

    const alert = await this.prisma.alert.update({
      where: { id },
      data: { status: AlertStatus.CANCELLED },
    });

    return this.mapAlertResponse(alert);
  }

  // Map database alert to response format
  private mapAlertResponse(alert: {
    id: string;
    userId: string;
    symbol: string;
    alertType: string;
    status: string;
    targetPrice: number | null;
    rsiThreshold: number | null;
    minSignalStrength: number | null;
    timeframe: string | null;
    note: string | null;
    repeatAlert: boolean;
    triggeredAt: Date | null;
    triggeredPrice: number | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: alert.id,
      userId: alert.userId,
      symbol: alert.symbol,
      type: alert.alertType as AlertType,
      status: alert.status as AlertStatus,
      targetPrice: alert.targetPrice,
      rsiThreshold: alert.rsiThreshold,
      minSignalStrength: alert.minSignalStrength,
      timeframe: alert.timeframe,
      note: alert.note,
      repeatAlert: alert.repeatAlert,
      triggeredAt: alert.triggeredAt,
      triggeredPrice: alert.triggeredPrice,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
    };
  }

  // Check alerts every 30 seconds
  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkAlerts() {
    const activeAlerts = await this.prisma.alert.findMany({
      where: { status: AlertStatus.ACTIVE },
      include: { user: { select: { id: true, email: true } } },
    });

    if (activeAlerts.length === 0) return;

    // Group alerts by symbol for efficient fetching
    const symbolGroups = new Map<string, AlertWithUser[]>();
    for (const alert of activeAlerts) {
      const alertWithUser: AlertWithUser = {
        ...alert,
        user: { id: alert.user.id, email: alert.user.email },
      };
      const existing = symbolGroups.get(alert.symbol) || [];
      existing.push(alertWithUser);
      symbolGroups.set(alert.symbol, existing);
    }

    // Check each symbol
    for (const [symbol, alerts] of symbolGroups) {
      try {
        await this.checkSymbolAlerts(symbol, alerts);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Failed to check alerts for ${symbol}: ${errorMessage}`,
        );
      }
    }
  }

  private async checkSymbolAlerts(symbol: string, alerts: AlertWithUser[]) {
    const ticker = await this.marketDataService.getTicker(symbol);
    const currentPrice = ticker.last;

    for (const alert of alerts) {
      let triggered = false;
      let message = '';

      const alertType = alert.alertType as AlertType;

      switch (alertType) {
        case AlertType.PRICE_ABOVE:
          if (alert.targetPrice && currentPrice >= alert.targetPrice) {
            triggered = true;
            message = `${symbol} price crossed above $${alert.targetPrice}. Current: $${currentPrice.toFixed(2)}`;
          }
          break;

        case AlertType.PRICE_BELOW:
          if (alert.targetPrice && currentPrice <= alert.targetPrice) {
            triggered = true;
            message = `${symbol} price crossed below $${alert.targetPrice}. Current: $${currentPrice.toFixed(2)}`;
          }
          break;

        case AlertType.RSI_OVERBOUGHT:
        case AlertType.RSI_OVERSOLD:
        case AlertType.MACD_BULLISH:
        case AlertType.MACD_BEARISH:
        case AlertType.AI_OPPORTUNITY: {
          const timeframe = (alert.timeframe || '1h') as Timeframe;
          try {
            const analysis = await this.technicalAnalysisService.analyze(
              symbol,
              timeframe,
              200,
            );

            if (
              alertType === AlertType.RSI_OVERBOUGHT &&
              alert.rsiThreshold &&
              analysis.rsi.value >= alert.rsiThreshold
            ) {
              triggered = true;
              message = `${symbol} RSI is overbought at ${analysis.rsi.value.toFixed(1)}`;
            }

            if (
              alertType === AlertType.RSI_OVERSOLD &&
              alert.rsiThreshold &&
              analysis.rsi.value <= alert.rsiThreshold
            ) {
              triggered = true;
              message = `${symbol} RSI is oversold at ${analysis.rsi.value.toFixed(1)}`;
            }

            if (
              alertType === AlertType.MACD_BULLISH &&
              analysis.macd.signal === 'bullish'
            ) {
              triggered = true;
              message = `${symbol} MACD bullish crossover detected`;
            }

            if (
              alertType === AlertType.MACD_BEARISH &&
              analysis.macd.signal === 'bearish'
            ) {
              triggered = true;
              message = `${symbol} MACD bearish crossover detected`;
            }

            if (
              alertType === AlertType.AI_OPPORTUNITY &&
              alert.minSignalStrength &&
              analysis.signalStrength >= alert.minSignalStrength
            ) {
              triggered = true;
              message = `${symbol} AI signal strength ${analysis.signalStrength}/10 (${analysis.overallTrend})`;
            }
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(
              `Failed to get analysis for ${symbol}: ${errorMessage}`,
            );
          }
          break;
        }

        default:
          this.logger.warn(`Unknown alert type: ${alert.alertType}`);
      }

      if (triggered) {
        await this.triggerAlert(alert, currentPrice, message);
      }
    }
  }

  private async triggerAlert(
    alert: AlertWithUser,
    triggeredPrice: number,
    message: string,
  ) {
    const updatedAlert = await this.prisma.alert.update({
      where: { id: alert.id },
      data: {
        status: AlertStatus.TRIGGERED,
        triggeredAt: new Date(),
        triggeredPrice,
      },
    });

    this.logger.log(`Alert triggered: ${alert.id} - ${message}`);

    // Broadcast via WebSocket
    this.wsGateway.broadcastAlert({
      id: updatedAlert.id,
      userId: alert.userId,
      symbol: alert.symbol,
      type: alert.alertType,
      message,
      triggeredPrice,
      triggeredAt: updatedAlert.triggeredAt?.toISOString(),
    });

    // If repeat alert, create a new active alert
    if (alert.repeatAlert) {
      await this.prisma.alert.create({
        data: {
          userId: alert.userId,
          symbol: alert.symbol,
          alertType: alert.alertType,
          status: AlertStatus.ACTIVE,
          targetPrice: alert.targetPrice,
          rsiThreshold: alert.rsiThreshold,
          minSignalStrength: alert.minSignalStrength,
          timeframe: alert.timeframe,
          note: alert.note,
          repeatAlert: alert.repeatAlert,
        },
      });
    }
  }
}
