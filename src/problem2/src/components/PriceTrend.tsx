import { Token } from "../types";

interface PriceTrendProps {
  token: Token;
}

export function PriceTrend({ token }: PriceTrendProps) {
  const getPriceChange = (token: Token) => {
    const mockChanges: Record<string, number> = {
      ETH: 2.5,
      BTC: -1.2,
      WBTC: -1.1,
      USD: 0,
      USDC: 0.01,
      SWTH: 5.8,
    };
    return mockChanges[token.currency] || 0;
  };

  const priceChange = getPriceChange(token);
  const isPositive = priceChange > 0;
  const isNeutral = priceChange === 0;

  if (isNeutral) return null;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${
        isPositive
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      }`}
    >
      {isPositive ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {Math.abs(priceChange).toFixed(2)}%
    </span>
  );
}
