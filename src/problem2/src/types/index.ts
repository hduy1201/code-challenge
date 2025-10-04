export interface Token {
  currency: string;
  price: number;
  icon?: string;
  name?: string;
}

export interface PriceData {
  currency: string;
  date: string;
  price: number;
}

export interface SwapFormData {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
}

export interface SwapResult {
  success: boolean;
  message: string;
  transactionHash?: string;
}
