import { Token } from "../types";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate amount input
 */
export function validateAmount(amount: string): ValidationResult {
  if (!amount || amount.trim() === "") {
    return {
      isValid: false,
      error: "Please enter an amount",
    };
  }

  const num = parseFloat(amount);

  if (isNaN(num)) {
    return {
      isValid: false,
      error: "Please enter a valid number",
    };
  }

  if (num <= 0) {
    return {
      isValid: false,
      error: "Amount must be greater than 0",
    };
  }

  if (num > 1000000000) {
    return {
      isValid: false,
      error: "Amount is too large",
    };
  }

  return { isValid: true };
}

/**
 * Validate token selection
 */
export function validateTokenSelection(
  fromToken: Token | null,
  toToken: Token | null
): ValidationResult {
  if (!fromToken) {
    return {
      isValid: false,
      error: "Please select a token to swap from",
    };
  }

  if (!toToken) {
    return {
      isValid: false,
      error: "Please select a token to swap to",
    };
  }

  if (fromToken.currency === toToken.currency) {
    return {
      isValid: false,
      error: "Cannot swap the same token",
    };
  }

  return { isValid: true };
}

/**
 * Validate entire swap form
 */
export function validateSwapForm(
  fromToken: Token | null,
  toToken: Token | null,
  amount: string
): ValidationResult {
  const tokenValidation = validateTokenSelection(fromToken, toToken);
  if (!tokenValidation.isValid) {
    return tokenValidation;
  }

  const amountValidation = validateAmount(amount);
  if (!amountValidation.isValid) {
    return amountValidation;
  }

  return { isValid: true };
}
