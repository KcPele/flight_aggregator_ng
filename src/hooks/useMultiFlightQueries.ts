import { AIRLINES_CONFIG } from "@/lib/config";
import { SearchParams } from "@/types/airport";
import { useQueries } from "@tanstack/react-query";

export const useMultiFlightQueries = <T>(searchParams: SearchParams) => {
  const queries = useQueries({
    queries: Object.entries(AIRLINES_CONFIG).map(([airline, config]) => ({
      queryKey: ["flights", airline, searchParams],
      queryFn: async (): Promise<T> => {
        const response = await fetch(
          config.endpoint + "?" + new URLSearchParams(searchParams as any)
        );
        if (!response.ok) {
          const res = await response.json();
          throw new Error(JSON.stringify(res));
        }
        return response.json();
      },
      enabled: false,
      retry: 1,
    })),
  });

  return {
    results: queries.map((q) => q.data as T),
    errors: queries.map((q) => JSON.parse(q.error?.message || "{}")),
    error: queries.some((q) => q.error),
    isLoading: queries.some((q) => q.isFetching),
    refetchAll: () => queries.forEach((q) => q.refetch()),
  };
};
