import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Token } from "../types";
import { formatNumber } from "../utils/formatters";

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  label: string;
  disabled?: boolean;
  excludeToken?: Token | null;
}

export function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  label,
  disabled = false,
  excludeToken = null,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = tokens.filter(
    (token) =>
      (token.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      token.currency !== excludeToken?.currency
  );

  const handleSelect = (token: Token) => {
    onSelect(token);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full input-field flex items-center justify-between py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedToken ? (
          <div className="flex items-center gap-2">
            <img
              src={selectedToken.icon}
              alt={selectedToken.currency}
              className="w-5 h-5 rounded-full flex-shrink-0"
              onError={(e) => {
                (
                  e.target as HTMLImageElement
                ).src = `https://ui-avatars.com/api/?name=${selectedToken.currency}&background=random`;
              }}
            />
            <div className="text-left flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">
                {selectedToken.currency}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {selectedToken.name}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-slate-400 text-sm">Select token</span>
        )}
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 card overflow-hidden flex flex-col max-h-96">
            <div className="flex-shrink-0 p-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent bg-white dark:bg-slate-700">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search token..."
                  className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {filteredTokens.map((token) => {
                  const isSelected = selectedToken?.currency === token.currency;
                  return (
                    <button
                      key={token.currency}
                      type="button"
                      onClick={() => handleSelect(token)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                        isSelected
                          ? "bg-primary-50 dark:bg-primary-900/30 ring-2 ring-primary-500 dark:ring-primary-600"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <img
                        src={token.icon}
                        alt={token.currency}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src = `https://ui-avatars.com/api/?name=${token.currency}&background=random`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold truncate ${
                            isSelected
                              ? "text-primary-700 dark:text-primary-300"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {token.currency}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                          {token.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          ${formatNumber(token.price, token.price < 1 ? 4 : 2)}
                        </div>
                        {isSelected && (
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}

                {filteredTokens.length === 0 && (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="font-medium">No tokens found</p>
                    <p className="text-sm mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
