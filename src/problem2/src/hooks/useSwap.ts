import { useState } from "react";
import { Token, SwapResult } from "../types";
import { validateSwapForm } from "../utils/validation";

export function useSwap() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitSwap = async (
    fromToken: Token | null,
    toToken: Token | null,
    amount: string
  ): Promise<SwapResult> => {
    // Validate
    const validation = validateSwapForm(fromToken, toToken, amount);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.error || "Validation failed",
      };
    }

    setIsSubmitting(true);

    // Simulate API call with delay
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsSubmitting(false);

        // Simulate 90% success rate
        const success = Math.random() > 0.1;

        if (success) {
          resolve({
            success: true,
            message: `Successfully swapped ${amount} ${fromToken?.currency} to ${toToken?.currency}`,
            transactionHash: `0x${Math.random()
              .toString(16)
              .slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`,
          });
        } else {
          resolve({
            success: false,
            message: "Swap failed. Please try again.",
          });
        }
      }, 2000); // 2 second delay
    });
  };

  return {
    submitSwap,
    isSubmitting,
  };
}
