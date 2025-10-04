import { Info } from "lucide-react";
import { Token } from "../types";
import { formatCurrency } from "../utils/formatters";

interface TransactionDetailsProps {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
}

export function TransactionDetails({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
}: TransactionDetailsProps) {
  if (!fromToken || !toToken || !fromAmount || !toAmount) return null;

  const networkFee = 2.5;
  const slippageTolerance = 0.5;
  const toAmountNum = parseFloat(toAmount) || 0;
  const minReceived = toAmountNum * (1 - slippageTolerance / 100);
  const priceImpact = 0.1;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-900/10 rounded-lg p-3 border border-slate-200 dark:border-slate-700 animate-slide-down">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Transaction Details
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Network Fee
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {formatCurrency(networkFee)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Slippage Tolerance
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {slippageTolerance}%
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Minimum Received
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {minReceived.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}{" "}
            {toToken.currency}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Price Impact
          </span>
          <span
            className={`font-medium ${
              priceImpact < 1
                ? "text-green-600 dark:text-green-400"
                : priceImpact < 3
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {priceImpact < 0.01 ? "< 0.01" : priceImpact.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
          <span className="text-slate-600 dark:text-slate-400">Route</span>
          <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1">
            {fromToken.currency}
            <svg
              className="w-3 h-3 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            {toToken.currency}
          </span>
        </div>
      </div>
    </div>
  );
}
