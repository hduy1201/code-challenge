interface WalletBalance {
  currency: string;
  amount: number;
  // ERROR: Missing 'blockchain' property which is used in line 39 and throughout the code
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  // ERROR: Duplicates properties from WalletBalance instead of extending it
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props; // ERROR: 'children' is destructured but never used in the component
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    // ERROR: Using 'any' type loses type safety. ERROR: Function is recreated on every render unnecessarily
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99; // ERROR: Magic number -99 used without explanation, should be a named constant
    }
  };

  const sortedBalances = useMemo(() => {
    // ERROR: getPriority is used here but not in dependency array, can cause stale closure issues
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          // ERROR: Variable 'lhsPriority' does not exist, should be 'balancePriority'. ERROR: Magic number -99 hardcoded
          if (balance.amount <= 0) {
            // ERROR: Logic is inverted - this returns true for balances with amount <= 0 (invalid balances)
            return true;
          }
        }
        return false; // ERROR: This returns false for all valid balances, completely wrong logic
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain); // ERROR: getPriority is called O(n log n) times during sort, very inefficient
        const rightPriority = getPriority(rhs.blockchain); // ERROR: getPriority is called O(n log n) times during sort, very inefficient
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // ERROR: Missing return statement when leftPriority === rightPriority, returns undefined
      });
  }, [balances, prices]); // ERROR: 'prices' is included in dependencies but not used in this useMemo, causes unnecessary re-computation

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    // ERROR: This variable is created but never used, wasteful computation
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  }); // ERROR: Not wrapped in useMemo, recalculated on every render

  const rows = sortedBalances.map(
    // ERROR: Not wrapped in useMemo, recalculated on every render. ERROR: Mapping sortedBalances again instead of using formattedBalances
    (balance: FormattedWalletBalance, index: number) => {
      // ERROR: Type mismatch - sortedBalances contains WalletBalance, not FormattedWalletBalance
      const usdValue = prices[balance.currency] * balance.amount; // ERROR: No check if prices[balance.currency] exists, potential NaN if undefined
      return (
        <WalletRow
          className={classes.row} // ERROR: 'classes' is not defined anywhere in the component
          key={index} // ERROR: Using array index as key is an anti-pattern, should use unique identifier like balance.currency
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted} // ERROR: balance.formatted does not exist on WalletBalance type
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
