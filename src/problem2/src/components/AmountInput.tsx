import { Token } from "../types";
import { formatCurrency } from "../utils/formatters";
import { QuickAmountButtons } from "./QuickAmountButtons";
import { PriceTrend } from "./PriceTrend";
import { TokenBadge } from "./TokenBadge";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  token: Token | null;
  label: string;
  readOnly?: boolean;
  error?: string;
  showQuickButtons?: boolean;
  onQuickAmount?: (percentage: number) => void;
  maxBalance?: string;
}

export function AmountInput({
  value,
  onChange,
  token,
  label,
  readOnly = false,
  error,
  showQuickButtons = false,
  onQuickAmount,
  maxBalance,
}: AmountInputProps) {
  // Format number with thousand separators
  const formatNumberWithCommas = (num: string): string => {
    if (!num) return "";

    const parts = num.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  const removeCommas = (str: string): string => {
    return str.replace(/,/g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const withoutCommas = removeCommas(input);

    if (withoutCommas === "" || /^\d*\.?\d*$/.test(withoutCommas)) {
      onChange(withoutCommas);
    }
  };

  const numericValue = removeCommas(value);
  const usdValue =
    token && numericValue ? parseFloat(numericValue) * token.price : 0;
  const displayValue = formatNumberWithCommas(value);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {token && (
          <div className="flex items-center gap-1.5">
            <TokenBadge token={token} />
            <PriceTrend token={token} />
          </div>
        )}
      </div>

      <div
        className={`input-field flex items-center gap-2 py-2.5 ${
          readOnly ? "bg-slate-50 dark:bg-slate-700 cursor-not-allowed" : ""
        } ${error ? "border-red-500" : ""}`}
      >
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder="0.00"
          className={`flex-1 bg-transparent outline-none text-right text-xl font-semibold ${
            readOnly ? "cursor-not-allowed" : ""
          }`}
        />
        {token && (
          <div className="text-slate-500 dark:text-slate-400 font-medium text-sm whitespace-nowrap">
            {token.currency}
          </div>
        )}
      </div>

      {showQuickButtons && !readOnly && token && onQuickAmount && (
        <div className="mt-2">
          <QuickAmountButtons
            onSelectPercentage={onQuickAmount}
            disabled={!maxBalance || maxBalance === "0"}
          />
        </div>
      )}

      <div className="mt-1 flex items-center justify-between">
        {usdValue > 0 && (
          <div className="text-xs text-slate-600 dark:text-slate-400">
            ≈ {formatCurrency(usdValue)}
          </div>
        )}
        {maxBalance && !readOnly && (
          <button
            type="button"
            onClick={() => onChange(maxBalance)}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Balance: {formatNumberWithCommas(maxBalance)}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
