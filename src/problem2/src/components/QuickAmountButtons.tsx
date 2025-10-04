interface QuickAmountButtonsProps {
  onSelectPercentage: (percentage: number) => void;
  disabled?: boolean;
}

export function QuickAmountButtons({
  onSelectPercentage,
  disabled = false,
}: QuickAmountButtonsProps) {
  const percentages = [25, 50, 75, 100];

  return (
    <div className="flex gap-1.5">
      {percentages.map((percentage) => (
        <button
          key={percentage}
          type="button"
          onClick={() => onSelectPercentage(percentage)}
          disabled={disabled}
          className="flex-1 px-2 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {percentage}%
        </button>
      ))}
    </div>
  );
}
