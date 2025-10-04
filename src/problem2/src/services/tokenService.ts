import axios from "axios";
import { PriceData, Token } from "../types";
import { TOKEN_ICONS_BASE_URL, TOKEN_NAMES } from "../constants/tokens";

const PRICES_API_URL = "https://interview.switcheo.com/prices.json";

export class TokenService {
  private static instance: TokenService;
  private tokenCache: Token[] | null = null;

  private constructor() {}

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Fetch prices from API
   */
  async fetchPrices(): Promise<PriceData[]> {
    try {
      const response = await axios.get<PriceData[]>(PRICES_API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching prices:", error);
      throw new Error("Failed to fetch token prices");
    }
  }

  /**
   * Get unique tokens with their latest prices
   */
  async getTokens(): Promise<Token[]> {
    if (this.tokenCache) {
      return this.tokenCache;
    }

    const prices = await this.fetchPrices();

    // Group by currency and get the latest price
    const tokenMap = new Map<string, PriceData>();

    prices.forEach((item) => {
      const existing = tokenMap.get(item.currency);
      if (!existing || new Date(item.date) > new Date(existing.date)) {
        tokenMap.set(item.currency, item);
      }
    });

    // Convert to Token array
    this.tokenCache = Array.from(tokenMap.values())
      .map((item) => ({
        currency: item.currency,
        price: item.price,
        icon: this.getTokenIcon(item.currency),
        name: TOKEN_NAMES[item.currency] || item.currency,
      }))
      .sort((a, b) => a.currency.localeCompare(b.currency));

    return this.tokenCache;
  }

  /**
   * Get token icon URL
   */
  getTokenIcon(currency: string): string {
    return `${TOKEN_ICONS_BASE_URL}/${currency}.svg`;
  }

  /**
   * Calculate exchange amount
   */
  calculateExchange(fromToken: Token, toToken: Token, amount: number): number {
    if (!fromToken.price || !toToken.price || amount <= 0) {
      return 0;
    }

    // amount_from × (price_from / price_to)
    return (amount * fromToken.price) / toToken.price;
  }

  /**
   * Get exchange rate between two tokens
   */
  getExchangeRate(fromToken: Token, toToken: Token): number {
    if (!fromToken.price || !toToken.price) {
      return 0;
    }
    return fromToken.price / toToken.price;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.tokenCache = null;
  }
}

export default TokenService.getInstance();
