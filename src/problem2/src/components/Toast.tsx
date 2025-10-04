import { useEffect, useState, useCallback } from "react";
import { CheckCircle, X, Copy, ExternalLink } from "lucide-react";

interface ToastProps {
  show: boolean;
  message: string;
  transactionHash?: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  show,
  message,
  transactionHash,
  onClose,
  duration = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsExiting(false);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsExiting(false);
    }
  }, [show, duration, handleClose]);

  const handleCopyHash = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  if (!isVisible && !show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div
        className={`
          bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700
          backdrop-blur-lg overflow-hidden
          ${isExiting ? "animate-toast-exit" : "animate-toast-enter"}
        `}
      >
        <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Swap Successful! 🎉
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {message}
              </p>

              {transactionHash && (
                <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
                        Transaction Hash
                      </p>
                      <code className="text-xs font-mono text-slate-700 dark:text-slate-300">
                        {truncateHash(transactionHash)}
                      </code>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={handleCopyHash}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                        title={copied ? "Copied!" : "Copy hash"}
                      >
                        {copied ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        )}
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                        title="View on Explorer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 animate-progress"
                  style={{
                    animation: `progress ${duration}ms linear forwards`,
                  }}
                ></div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex-shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes toast-enter {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes toast-exit {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
        }

        @keyframes progress {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }

        .animate-toast-enter {
          animation: toast-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-toast-exit {
          animation: toast-exit 0.3s cubic-bezier(0.5, 0, 0.75, 0) forwards;
        }

        .animate-progress {
          animation: progress linear forwards;
        }
      `}</style>
    </div>
  );
}
