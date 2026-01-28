export interface SymbolInfo {
  symbol: string
  name: string
  category: "CRYPTO" | "FOREX" | "ETF" | "COMMODITY" | "INDEX"
}

export const SYMBOLS: SymbolInfo[] = [
  // Crypto - Major
  { symbol: "BTC/USDT", name: "Bitcoin", category: "CRYPTO" },
  { symbol: "ETH/USDT", name: "Ethereum", category: "CRYPTO" },
  { symbol: "BNB/USDT", name: "Binance Coin", category: "CRYPTO" },
  { symbol: "SOL/USDT", name: "Solana", category: "CRYPTO" },
  { symbol: "XRP/USDT", name: "Ripple", category: "CRYPTO" },
  { symbol: "ADA/USDT", name: "Cardano", category: "CRYPTO" },
  { symbol: "DOGE/USDT", name: "Dogecoin", category: "CRYPTO" },
  { symbol: "DOT/USDT", name: "Polkadot", category: "CRYPTO" },
  { symbol: "AVAX/USDT", name: "Avalanche", category: "CRYPTO" },
  { symbol: "LINK/USDT", name: "Chainlink", category: "CRYPTO" },
  { symbol: "MATIC/USDT", name: "Polygon", category: "CRYPTO" },
  { symbol: "UNI/USDT", name: "Uniswap", category: "CRYPTO" },
  { symbol: "ATOM/USDT", name: "Cosmos", category: "CRYPTO" },
  { symbol: "LTC/USDT", name: "Litecoin", category: "CRYPTO" },
  { symbol: "APT/USDT", name: "Aptos", category: "CRYPTO" },
  { symbol: "ARB/USDT", name: "Arbitrum", category: "CRYPTO" },
  { symbol: "OP/USDT", name: "Optimism", category: "CRYPTO" },
  { symbol: "INJ/USDT", name: "Injective", category: "CRYPTO" },
  { symbol: "SUI/USDT", name: "Sui", category: "CRYPTO" },
  { symbol: "SEI/USDT", name: "Sei", category: "CRYPTO" },

  // Forex - Major Pairs
  { symbol: "EUR/USD", name: "Euro / US Dollar", category: "FOREX" },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", category: "FOREX" },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", category: "FOREX" },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", category: "FOREX" },
  {
    symbol: "AUD/USD",
    name: "Australian Dollar / US Dollar",
    category: "FOREX",
  },
  {
    symbol: "NZD/USD",
    name: "New Zealand Dollar / US Dollar",
    category: "FOREX",
  },
  { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", category: "FOREX" },

  // Forex - Minor Pairs
  { symbol: "EUR/GBP", name: "Euro / British Pound", category: "FOREX" },
  { symbol: "EUR/JPY", name: "Euro / Japanese Yen", category: "FOREX" },
  {
    symbol: "GBP/JPY",
    name: "British Pound / Japanese Yen",
    category: "FOREX",
  },
  { symbol: "EUR/AUD", name: "Euro / Australian Dollar", category: "FOREX" },
  {
    symbol: "GBP/AUD",
    name: "British Pound / Australian Dollar",
    category: "FOREX",
  },
  { symbol: "EUR/CAD", name: "Euro / Canadian Dollar", category: "FOREX" },
  {
    symbol: "AUD/JPY",
    name: "Australian Dollar / Japanese Yen",
    category: "FOREX",
  },
  { symbol: "CHF/JPY", name: "Swiss Franc / Japanese Yen", category: "FOREX" },
  {
    symbol: "NZD/JPY",
    name: "New Zealand Dollar / Japanese Yen",
    category: "FOREX",
  },
  {
    symbol: "CAD/JPY",
    name: "Canadian Dollar / Japanese Yen",
    category: "FOREX",
  },
  {
    symbol: "AUD/NZD",
    name: "Australian Dollar / New Zealand Dollar",
    category: "FOREX",
  },
  { symbol: "EUR/NZD", name: "Euro / New Zealand Dollar", category: "FOREX" },
  {
    symbol: "GBP/NZD",
    name: "British Pound / New Zealand Dollar",
    category: "FOREX",
  },
  {
    symbol: "GBP/CAD",
    name: "British Pound / Canadian Dollar",
    category: "FOREX",
  },
  {
    symbol: "AUD/CAD",
    name: "Australian Dollar / Canadian Dollar",
    category: "FOREX",
  },

  // Forex - Exotic Pairs
  { symbol: "USD/MXN", name: "US Dollar / Mexican Peso", category: "FOREX" },
  {
    symbol: "USD/ZAR",
    name: "US Dollar / South African Rand",
    category: "FOREX",
  },
  { symbol: "USD/TRY", name: "US Dollar / Turkish Lira", category: "FOREX" },
  {
    symbol: "USD/SGD",
    name: "US Dollar / Singapore Dollar",
    category: "FOREX",
  },
  {
    symbol: "USD/HKD",
    name: "US Dollar / Hong Kong Dollar",
    category: "FOREX",
  },
  { symbol: "USD/SEK", name: "US Dollar / Swedish Krona", category: "FOREX" },
  { symbol: "USD/NOK", name: "US Dollar / Norwegian Krone", category: "FOREX" },
  { symbol: "USD/DKK", name: "US Dollar / Danish Krone", category: "FOREX" },
  { symbol: "EUR/TRY", name: "Euro / Turkish Lira", category: "FOREX" },
  { symbol: "EUR/SEK", name: "Euro / Swedish Krona", category: "FOREX" },
  { symbol: "EUR/NOK", name: "Euro / Norwegian Krone", category: "FOREX" },

  // ETFs - US Market
  { symbol: "SPY", name: "S&P 500 ETF", category: "ETF" },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", category: "ETF" },
  { symbol: "DIA", name: "Dow Jones ETF", category: "ETF" },
  { symbol: "IWM", name: "Russell 2000 ETF", category: "ETF" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", category: "ETF" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", category: "ETF" },
  {
    symbol: "VEA",
    name: "Vanguard FTSE Developed Markets ETF",
    category: "ETF",
  },
  {
    symbol: "VWO",
    name: "Vanguard FTSE Emerging Markets ETF",
    category: "ETF",
  },

  // ETFs - Sector
  { symbol: "XLF", name: "Financial Select Sector ETF", category: "ETF" },
  { symbol: "XLK", name: "Technology Select Sector ETF", category: "ETF" },
  { symbol: "XLE", name: "Energy Select Sector ETF", category: "ETF" },
  { symbol: "XLV", name: "Health Care Select Sector ETF", category: "ETF" },
  { symbol: "XLI", name: "Industrial Select Sector ETF", category: "ETF" },
  {
    symbol: "XLP",
    name: "Consumer Staples Select Sector ETF",
    category: "ETF",
  },
  {
    symbol: "XLY",
    name: "Consumer Discretionary Select Sector ETF",
    category: "ETF",
  },
  { symbol: "XLU", name: "Utilities Select Sector ETF", category: "ETF" },
  { symbol: "XLB", name: "Materials Select Sector ETF", category: "ETF" },
  { symbol: "XLRE", name: "Real Estate Select Sector ETF", category: "ETF" },

  // ETFs - Bonds
  {
    symbol: "TLT",
    name: "iShares 20+ Year Treasury Bond ETF",
    category: "ETF",
  },
  {
    symbol: "IEF",
    name: "iShares 7-10 Year Treasury Bond ETF",
    category: "ETF",
  },
  {
    symbol: "SHY",
    name: "iShares 1-3 Year Treasury Bond ETF",
    category: "ETF",
  },
  {
    symbol: "LQD",
    name: "iShares Investment Grade Corporate Bond ETF",
    category: "ETF",
  },
  {
    symbol: "HYG",
    name: "iShares High Yield Corporate Bond ETF",
    category: "ETF",
  },
  {
    symbol: "AGG",
    name: "iShares Core US Aggregate Bond ETF",
    category: "ETF",
  },
  { symbol: "BND", name: "Vanguard Total Bond Market ETF", category: "ETF" },

  // ETFs - International
  { symbol: "EFA", name: "iShares MSCI EAFE ETF", category: "ETF" },
  { symbol: "EEM", name: "iShares MSCI Emerging Markets ETF", category: "ETF" },
  { symbol: "FXI", name: "iShares China Large-Cap ETF", category: "ETF" },
  { symbol: "EWJ", name: "iShares MSCI Japan ETF", category: "ETF" },
  { symbol: "EWG", name: "iShares MSCI Germany ETF", category: "ETF" },
  { symbol: "EWU", name: "iShares MSCI United Kingdom ETF", category: "ETF" },

  // ETFs - Commodities
  { symbol: "GLD", name: "SPDR Gold Trust", category: "COMMODITY" },
  { symbol: "SLV", name: "iShares Silver Trust", category: "COMMODITY" },
  { symbol: "USO", name: "United States Oil Fund", category: "COMMODITY" },
  {
    symbol: "UNG",
    name: "United States Natural Gas Fund",
    category: "COMMODITY",
  },
  { symbol: "DBA", name: "Invesco DB Agriculture Fund", category: "COMMODITY" },
  {
    symbol: "DBC",
    name: "Invesco DB Commodity Index Tracking Fund",
    category: "COMMODITY",
  },
  {
    symbol: "PDBC",
    name: "Invesco Optimum Yield Diversified Commodity",
    category: "COMMODITY",
  },
  {
    symbol: "CPER",
    name: "United States Copper Index Fund",
    category: "COMMODITY",
  },
  { symbol: "WEAT", name: "Teucrium Wheat Fund", category: "COMMODITY" },
  { symbol: "CORN", name: "Teucrium Corn Fund", category: "COMMODITY" },
  { symbol: "SOYB", name: "Teucrium Soybean Fund", category: "COMMODITY" },

  // ETFs - Leveraged/Inverse
  { symbol: "TQQQ", name: "ProShares UltraPro QQQ (3x)", category: "ETF" },
  {
    symbol: "SQQQ",
    name: "ProShares UltraPro Short QQQ (-3x)",
    category: "ETF",
  },
  { symbol: "SPXL", name: "Direxion Daily S&P 500 Bull 3X", category: "ETF" },
  { symbol: "SPXS", name: "Direxion Daily S&P 500 Bear 3X", category: "ETF" },
  {
    symbol: "UVXY",
    name: "ProShares Ultra VIX Short-Term Futures",
    category: "ETF",
  },

  // Indices (for reference/display)
  { symbol: "US500", name: "S&P 500 Index", category: "INDEX" },
  { symbol: "US100", name: "Nasdaq 100 Index", category: "INDEX" },
  { symbol: "US30", name: "Dow Jones 30 Index", category: "INDEX" },
  { symbol: "DE40", name: "DAX 40 Index", category: "INDEX" },
  { symbol: "UK100", name: "FTSE 100 Index", category: "INDEX" },
  { symbol: "JP225", name: "Nikkei 225 Index", category: "INDEX" },
  { symbol: "HK50", name: "Hang Seng Index", category: "INDEX" },
  { symbol: "AU200", name: "ASX 200 Index", category: "INDEX" },
]

export const SYMBOL_CATEGORIES = [
  { value: "ALL", label: "All Assets" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "FOREX", label: "Forex" },
  { value: "ETF", label: "ETFs" },
  { value: "COMMODITY", label: "Commodities" },
  { value: "INDEX", label: "Indices" },
] as const

export type SymbolCategory = (typeof SYMBOL_CATEGORIES)[number]["value"]

export function getSymbolsByCategory(category: SymbolCategory): SymbolInfo[] {
  if (category === "ALL") return SYMBOLS
  return SYMBOLS.filter((s) => s.category === category)
}

export function getSymbolInfo(symbol: string): SymbolInfo | undefined {
  return SYMBOLS.find((s) => s.symbol === symbol)
}

export function searchSymbols(
  query: string,
  category?: SymbolCategory,
): SymbolInfo[] {
  const searchTerm = query.toLowerCase()
  let filtered = SYMBOLS

  if (category && category !== "ALL") {
    filtered = filtered.filter((s) => s.category === category)
  }

  return filtered.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchTerm) ||
      s.name.toLowerCase().includes(searchTerm),
  )
}
