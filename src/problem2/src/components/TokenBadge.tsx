import { Token } from "../types";

interface TokenBadgeProps {
  token: Token;
}

export function TokenBadge({ token }: TokenBadgeProps) {
  const getTokenBadge = (token: Token) => {
    const popularTokens = ["ETH", "BTC", "WBTC", "USD", "USDC"];
    const verifiedTokens = ["ETH", "BTC", "WBTC", "USD", "USDC", "SWTH"];

    if (popularTokens.includes(token.currency)) {
      return {
        label: "Popular",
        color:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      };
    }
    if (verifiedTokens.includes(token.currency)) {
      return {
        label: "Verified",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      };
    }
    return null;
  };

  const badge = getTokenBadge(token);

  if (!badge) return null;

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${badge.color}`}
    >
      {badge.label === "Verified" && (
        <svg
          className="w-2.5 h-2.5 mr-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {badge.label === "Popular" && "🔥"}
      {badge.label}
    </span>
  );
}
