

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "./types";

export interface Failure {
  code: string;
  message: string;
}

export function toFailure(error: unknown): Failure {
  if (error instanceof ApiError) {
    return { code: error.code, message: error.message };
  }
  return {
    code: "UNEXPECTED_ERROR",
    message: error instanceof Error ? error.message : "Something went wrong.",
  };
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Failure | null;
  reload: () => void;
}

export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Failure | null>(null);
  const [nonce, setNonce] = useState(0);

  
  const run = useCallback(load, deps);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    run()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        
        setData(null);
        setError(toFailure(cause));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [run, nonce]);

  return { data, loading, error, reload: () => setNonce((n) => n + 1) };
}
