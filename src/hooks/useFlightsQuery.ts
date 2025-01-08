import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

const fetchFlights = async <T>(
  params: Record<string, string>,
  url: string
): Promise<T> => {
  const response = await fetch(url + "?" + new URLSearchParams(params));

  if (!response.ok) {
    throw new Error("Failed to fetch flights");
  }

  return response.json();
};

export const useFlightsQuery = <T>(
  queryParams: Record<string, string>,
  url: string,
  options?: UseQueryOptions<T, Error>
): UseQueryResult<T, Error> => {
  return useQuery<T, Error>({
    queryKey: ["flights", queryParams],
    queryFn: () => fetchFlights<T>(queryParams, url),
    enabled: !!queryParams, // Default enabled behavior
    ...options, // Merge additional options
    retry: 1, // Retry once on failure
  });
};
