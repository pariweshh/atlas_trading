# ATLAS - AI Trading Analysis System

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/NestJS-11-red?style=for-the-badge&logo=nestjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Claude_AI-Sonnet_4-orange?style=for-the-badge&logo=anthropic" />
</div>

<br />

ATLAS is an **institutional-grade AI-powered trading analysis platform** for Forex, Cryptocurrency, and ETF markets. It combines technical analysis with Claude AI to generate professional trade recommendations with proper risk management.

## ✨ Features

### 🤖 AI-Powered Analysis

- **Claude AI Integration** - Generates institutional-grade trade recommendations
- **Risk Management** - Enforces minimum R:R ratios based on trading style
- **Position Sizing** - Calculates optimal position size based on account and risk

### 📊 Technical Analysis

- **7 Indicators** - RSI, MACD, Bollinger Bands, Stochastic, ATR, Moving Averages
- **Support/Resistance** - Automatic detection of key price levels
- **Trend Detection** - Overall trend analysis with signal strength (1-10)

### 📈 Market Data

- **Binance** - Real-time crypto data (no API key required)
- **OANDA** - Forex data (API key required)
- **Polygon** - ETF/Stock data (API key required)

### 🎯 Trading Features

- **100+ Symbols** - Crypto, Forex, ETFs, Commodities
- **Multiple Timeframes** - 5m, 15m, 1H, 4H, 1D
- **Trading Styles** - Scalping, Day Trading, Swing, Position
- **Market Scanner** - Scan multiple assets for opportunities

## 🛠️ Tech Stack

### Backend

- **NestJS 11** - Node.js framework
- **Prisma 7** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Claude AI** - Trade analysis

### Frontend

- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Lightweight Charts** - Trading charts

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Anthropic API Key (for AI analysis)
- Optional: OANDA API Key (for forex)
- Optional: Polygon API Key (for ETFs)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/atlas.git
cd atlas
```

2. **Setup Backend**

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npx prisma migrate dev

# Start the server
npm run start:dev
```

3. **Setup Frontend**

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local

# Start the development server
npm run dev
```

4. **Access the application**

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api/v1
- API Docs: http://localhost:3000/docs

## 📁 Project Structure

```
atlas/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── database/
│   │   ├── common/
│   │   └── modules/
│   │       ├── auth/
│   │       ├── market-data/
│   │       ├── technical-analysis/
│   │       └── llm-analysis/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── stores/
│   │   └── types/
│   └── package.json
│
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/atlas
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
ANTHROPIC_API_KEY=your-anthropic-key
OANDA_API_KEY=your-oanda-key (optional)
OANDA_ACCOUNT_ID=your-oanda-account (optional)
POLYGON_API_KEY=your-polygon-key (optional)
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 📡 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Market Data

- `GET /api/v1/market-data/ticker` - Get ticker data
- `GET /api/v1/market-data/ohlcv` - Get candlestick data
- `GET /api/v1/market-data/symbols` - List available symbols

### Analysis

- `GET /api/v1/analysis/technical` - Get technical analysis
- `POST /api/v1/analysis/ai` - Get AI trade recommendation

## 🎨 Screenshots

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### AI Recommendation

![AI Recommendation](docs/screenshots/ai-recommendation.png)

## 📝 Trading Styles

| Style       | Min R:R | Max Stop | Timeframes  |
| ----------- | ------- | -------- | ----------- |
| Scalping    | 1:1.5   | 0.5%     | 1m, 5m, 15m |
| Day Trading | 1:2     | 1%       | 15m, 1H     |
| Swing       | 1:2.5   | 2%       | 1H, 4H, 1D  |
| Position    | 1:3     | 3%       | 4H, 1D, 1W  |

## ⚠️ Disclaimer

**ATLAS is for educational and informational purposes only.**

- Not financial advice
- Past performance doesn't guarantee future results
- Always do your own research
- Never trade with money you can't afford to lose

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📧 Contact

- GitHub Issues for bug reports
- Discussions for feature requests
