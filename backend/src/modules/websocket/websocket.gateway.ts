import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MarketDataService } from '../market-data/market-data.service';

interface SubscriptionRequest {
  symbols: string[];
}

interface TickerBroadcast {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume24h: number;
  change24h: number;
  changePercent24h: number;
  timestamp: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/market',
})
export class WebSocketMarketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('WebSocketGateway');
  private clientSubscriptions: Map<string, Set<string>> = new Map();
  private priceUpdateInterval: NodeJS.Timeout | null = null;
  private activeSymbols: Set<string> = new Set();

  constructor(private readonly marketDataService: MarketDataService) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
    this.startPriceUpdates();
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clientSubscriptions.set(client.id, new Set());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clientSubscriptions.delete(client.id);
    this.updateActiveSymbols();
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SubscriptionRequest,
  ): { event: string; data: { symbols: string[] } } {
    const clientSubs = this.clientSubscriptions.get(client.id);
    if (!clientSubs) {
      return { event: 'error', data: { symbols: [] } };
    }

    data.symbols.forEach((sym) => {
      clientSubs.add(sym);
      void client.join(`symbol:${sym}`);
      this.logger.debug(`Client ${client.id} subscribed to ${sym}`);
    });

    this.updateActiveSymbols();

    // Send initial data for subscribed symbols
    void this.sendInitialData(client, data.symbols);

    return { event: 'subscribed', data: { symbols: data.symbols } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SubscriptionRequest,
  ): { event: string; data: { symbols: string[] } } {
    const clientSubs = this.clientSubscriptions.get(client.id);
    if (!clientSubs) {
      return { event: 'error', data: { symbols: [] } };
    }

    data.symbols.forEach((sym) => {
      clientSubs.delete(sym);
      void client.leave(`symbol:${sym}`);
      this.logger.debug(`Client ${client.id} unsubscribed from ${sym}`);
    });

    this.updateActiveSymbols();

    return { event: 'unsubscribed', data: { symbols: data.symbols } };
  }

  private updateActiveSymbols(): void {
    this.activeSymbols.clear();
    this.clientSubscriptions.forEach((symbols) => {
      symbols.forEach((sym) => this.activeSymbols.add(sym));
    });
    this.logger.debug(
      `Active symbols: ${Array.from(this.activeSymbols).join(', ')}`,
    );
  }

  private async sendInitialData(
    client: Socket,
    symbols: string[],
  ): Promise<void> {
    for (const sym of symbols) {
      try {
        const ticker = await this.marketDataService.getTicker(sym);
        const tickerData: TickerBroadcast = {
          symbol: sym,
          bid: ticker.bid,
          ask: ticker.ask,
          last: ticker.last,
          volume24h: ticker.volume24h,
          change24h: ticker.change24h,
          changePercent24h: ticker.changePercent24h,
          timestamp: new Date().toISOString(),
        };
        client.emit('ticker', tickerData);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Failed to fetch initial data for ${sym}: ${errorMessage}`,
        );
      }
    }
  }

  private startPriceUpdates(): void {
    // Update prices every 5 seconds
    this.priceUpdateInterval = setInterval(() => {
      void this.broadcastPriceUpdates();
    }, 5000);
  }

  private async broadcastPriceUpdates(): Promise<void> {
    if (this.activeSymbols.size === 0) return;

    for (const sym of this.activeSymbols) {
      try {
        const ticker = await this.marketDataService.getTicker(sym);
        const tickerData: TickerBroadcast = {
          symbol: sym,
          bid: ticker.bid,
          ask: ticker.ask,
          last: ticker.last,
          volume24h: ticker.volume24h,
          change24h: ticker.change24h,
          changePercent24h: ticker.changePercent24h,
          timestamp: new Date().toISOString(),
        };
        this.server.to(`symbol:${sym}`).emit('ticker', tickerData);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to update ${sym}: ${errorMessage}`);
      }
    }
  }

  // Method to broadcast price updates from external sources
  broadcastTicker(
    sym: string,
    data: {
      bid: number;
      ask: number;
      last: number;
      volume24h: number;
      change24h: number;
      changePercent24h: number;
    },
  ): void {
    const tickerData: TickerBroadcast = {
      symbol: sym,
      bid: data.bid,
      ask: data.ask,
      last: data.last,
      volume24h: data.volume24h,
      change24h: data.change24h,
      changePercent24h: data.changePercent24h,
      timestamp: new Date().toISOString(),
    };
    this.server.to(`symbol:${sym}`).emit('ticker', tickerData);
  }

  // Method to broadcast alerts
  broadcastAlert(alert: Record<string, unknown>): void {
    this.server.emit('alert', alert);
  }
}
