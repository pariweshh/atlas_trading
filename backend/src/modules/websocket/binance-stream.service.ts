import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { WebSocket } from 'ws';
import { WebSocketMarketGateway } from './websocket.gateway';

interface BinanceTickerData {
  e: string; // Event type
  s: string; // Symbol
  c: string; // Close price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Volume
  q: string; // Quote volume
  P: string; // Price change percent
  p: string; // Price change
}

@Injectable()
export class BinanceStreamService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger('BinanceStream');
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private subscribedSymbols: Set<string> = new Set();
  private isConnected = false;

  constructor(private readonly wsGateway: WebSocketMarketGateway) {}

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.disconnect();
  }

  private connect() {
    const streams = this.getDefaultStreams();
    const url = `wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`;

    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      this.logger.log('Connected to Binance WebSocket');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.ws.on('message', (data: Buffer) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.data) {
          this.handleTickerUpdate(parsed.data);
        }
      } catch (error) {
        this.logger.error(`Failed to parse message: ${error.message}`);
      }
    });

    this.ws.on('error', (error) => {
      this.logger.error(`WebSocket error: ${error.message}`);
    });

    this.ws.on('close', () => {
      this.logger.warn('Binance WebSocket disconnected');
      this.isConnected = false;
      this.attemptReconnect();
    });
  }

  private disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.logger.log(
        `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`,
      );
      setTimeout(() => this.connect(), delay);
    } else {
      this.logger.error('Max reconnection attempts reached');
    }
  }

  private getDefaultStreams(): string[] {
    const symbols = [
      'btcusdt',
      'ethusdt',
      'bnbusdt',
      'solusdt',
      'xrpusdt',
      'adausdt',
      'dogeusdt',
      'dotusdt',
      'avaxusdt',
      'linkusdt',
      'maticusdt',
      'uniusdt',
      'atomusdt',
      'ltcusdt',
      'aptusdt',
      'arbusdt',
      'opusdt',
      'injusdt',
      'suiusdt',
      'seiusdt',
    ];
    return symbols.map((s) => `${s}@ticker`);
  }

  private handleTickerUpdate(data: BinanceTickerData) {
    if (data.e !== '24hrTicker') return;

    const symbol = this.formatSymbol(data.s);

    const ticker = {
      symbol,
      bid: parseFloat(data.c), // Using close as bid approximation
      ask: parseFloat(data.c),
      last: parseFloat(data.c),
      open: parseFloat(data.o),
      high: parseFloat(data.h),
      low: parseFloat(data.l),
      volume24h: parseFloat(data.v),
      quoteVolume24h: parseFloat(data.q),
      change24h: parseFloat(data.p),
      changePercent24h: parseFloat(data.P),
    };

    this.wsGateway.broadcastTicker(symbol, ticker);
  }

  private formatSymbol(binanceSymbol: string): string {
    // Convert BTCUSDT to BTC/USDT
    if (binanceSymbol.endsWith('USDT')) {
      return `${binanceSymbol.slice(0, -4)}/USDT`;
    }
    return binanceSymbol;
  }

  subscribeToSymbol(symbol: string) {
    this.subscribedSymbols.add(symbol);
    // For dynamic subscription, you'd need to use the combined stream approach
    // or reconnect with new streams
  }

  unsubscribeFromSymbol(symbol: string) {
    this.subscribedSymbols.delete(symbol);
  }
}
