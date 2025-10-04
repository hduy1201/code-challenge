import { useState } from "react";
import { Token } from "./types";
import { useTokens } from "./hooks/useTokens";
import { useSwap } from "./hooks/useSwap";
import tokenService from "./services/tokenService";
import { formatNumber, parseNumberInput } from "./utils/formatters";
import { validateAmount } from "./utils/validation";
import { TokenSelector } from "./components/TokenSelector";
import { AmountInput } from "./components/AmountInput";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";
import { ValidationError } from "./components/ValidationError";
import { TransactionDetails } from "./components/TransactionDetails";
import { Confetti } from "./components/Confetti";
import { Toast } from "./components/Toast";

function App() {
  const { tokens, loading, error, refetch } = useTokens();
  const { submitSwap, isSubmitting } = useSwap();

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const mockBalance: Record<string, string> = {
    ETH: "10.5",
    BTC: "0.25",
    WBTC: "0.25",
    USD: "50000",
    USDC: "50000",
    SWTH: "1000000",
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setValidationError("");
    setSuccessMessage("");

    if (fromToken && toToken && value) {
      const num = parseNumberInput(value);
      if (num > 0) {
        const result = tokenService.calculateExchange(fromToken, toToken, num);
        setToAmount(result.toString());
      } else {
        setToAmount("");
      }
    } else {
      setToAmount("");
    }
  };

  const handleQuickAmount = (percentage: number) => {
    if (!fromToken) return;

    const balance = mockBalance[fromToken.currency] || "0";
    const balanceNum = parseFloat(balance);
    const amount = (balanceNum * percentage) / 100;

    handleFromAmountChange(amount.toString());
  };

  const handleFromTokenSelect = (token: Token) => {
    setFromToken(token);
    if (toToken && fromAmount) {
      const num = parseNumberInput(fromAmount);
      if (num > 0) {
        const result = tokenService.calculateExchange(token, toToken, num);
        setToAmount(result.toString());
      }
    }
  };

  const handleToTokenSelect = (token: Token) => {
    setToToken(token);
    if (fromToken && fromAmount) {
      const num = parseNumberInput(fromAmount);
      if (num > 0) {
        const result = tokenService.calculateExchange(fromToken, token, num);
        setToAmount(result.toString());
      }
    }
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempFromAmount = fromAmount;
    const tempToAmount = toAmount;

    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(tempToAmount);
    setToAmount(tempFromAmount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMessage("");
    setTransactionHash("");

    const result = await submitSwap(fromToken, toToken, fromAmount);

    if (result.success) {
      setSuccessMessage(result.message);
      setTransactionHash(result.transactionHash || "");
    } else {
      setValidationError(result.message);
    }
  };

  const exchangeRate =
    fromToken && toToken ? tokenService.getExchangeRate(fromToken, toToken) : 0;

  const isFormValid =
    fromToken && toToken && fromAmount && validateAmount(fromAmount).isValid;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400 rounded-full opacity-60 animate-particle-1"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full opacity-50 animate-particle-2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-particle-3"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary-500 rounded-full opacity-40 animate-particle-4"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-300 rounded-full opacity-50 animate-particle-5"></div>
      </div>

      <Confetti show={!!successMessage} />

      <Toast
        show={!!successMessage}
        message={successMessage}
        transactionHash={transactionHash}
        onClose={() => {
          setSuccessMessage("");
          setTransactionHash("");
          setFromAmount("");
          setToAmount("");
        }}
        duration={5000}
      />

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent mb-1">
            Currency Swap
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Swap tokens instantly with real-time rates
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card p-5 space-y-4 animate-fade-in"
        >
          <div className="space-y-3">
            <TokenSelector
              tokens={tokens}
              selectedToken={fromToken}
              onSelect={handleFromTokenSelect}
              label="From"
              excludeToken={toToken}
            />

            <AmountInput
              value={fromAmount}
              onChange={handleFromAmountChange}
              token={fromToken}
              label="Amount"
              showQuickButtons={true}
              onQuickAmount={handleQuickAmount}
              maxBalance={
                fromToken ? mockBalance[fromToken.currency] : undefined
              }
            />
          </div>

          <TransactionDetails
            fromToken={fromToken}
            toToken={toToken}
            fromAmount={fromAmount}
            toAmount={toAmount}
          />

          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={handleSwapTokens}
              disabled={!fromToken || !toToken}
              className="p-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-900 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-110 active:scale-95"
              aria-label="Swap tokens"
            >
              <svg
                className="w-5 h-5 text-primary-600 dark:text-primary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <TokenSelector
              tokens={tokens}
              selectedToken={toToken}
              onSelect={handleToTokenSelect}
              label="To"
              excludeToken={fromToken}
            />

            <AmountInput
              value={toAmount}
              onChange={() => {}}
              token={toToken}
              label="You will receive"
              readOnly
            />
          </div>

          {fromToken && toToken && exchangeRate > 0 && (
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 p-3 rounded-lg border border-primary-100 dark:border-primary-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Rate
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  1 {fromToken.currency} = {formatNumber(exchangeRate, 4)}{" "}
                  {toToken.currency}
                </p>
              </div>
            </div>
          )}

          {validationError && <ValidationError message={validationError} />}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full btn-primary py-3"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Swap Now"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Powered by{" "}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              Switcheo
            </span>{" "}
            • React + Vite + TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
