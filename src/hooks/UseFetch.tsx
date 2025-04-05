import { useState, useCallback } from "react";

export const useApiFetch = <T,>() => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl =
    import.meta.env.VITE_API_URL || "https://sugarytestapi.azurewebsites.net/";

  const fetchData = useCallback(
    async (path: string, options: RequestInit = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}${path}`, {
          method: "GET", //default to GET
          headers: { "Content-Type": "application/json" },
          ...options,
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.Message || `Error ${response.status}`);
        }

        const result: T = await response.json();
        setData(result);
        setIsLoading(false);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  return { data, isLoading, error, fetchData };
};

export default useApiFetch;
