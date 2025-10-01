type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const UNKNOWN_BLOCKCHAIN_PRIORITY = -99;

const getPriority = (blockchain: Blockchain | string): number => {
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
      return UNKNOWN_BLOCKCHAIN_PRIORITY;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    const balancesWithPriority = balances.map((balance: WalletBalance) => ({
      ...balance,
      priority: getPriority(balance.blockchain),
    }));

    return balancesWithPriority
      .filter((balance) => {
        return (
          balance.priority > UNKNOWN_BLOCKCHAIN_PRIORITY && balance.amount > 0
        );
      })
      .sort((lhs, rhs) => {
        return rhs.priority - lhs.priority;
      });
  }, [balances]);

  const rows = useMemo(() => {
    return sortedBalances.map((balance) => {
      const formatted = balance.amount.toFixed();
      const price = prices[balance.currency] ?? 0;
      const usdValue = price * balance.amount;

      return (
        <WalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formatted}
        />
      );
    });
  }, [sortedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
