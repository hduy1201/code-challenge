import { useState, useEffect } from "react";
import { Token } from "../types";
import tokenService from "../services/tokenService";

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tokenService.getTokens();
      setTokens(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    tokenService.clearCache();
    loadTokens();
  };

  return { tokens, loading, error, refetch };
}
