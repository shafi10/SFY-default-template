import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useMemo } from "react";
import { useQuery, UseQueryResult } from "react-query";

interface UseFetchQueryParams {
  apiEndpoint: string;
  apiKey: string;
  dependency?: any[];
  fetchInit?: RequestInit;
}

const useFetchQuery = <T = any>({
  apiEndpoint,
  apiKey,
  dependency = [],
  fetchInit = {},
}: UseFetchQueryParams): UseQueryResult<T, Error> => {
  const authenticatedFetch = useAuthenticatedFetch();
  const fetch = useMemo(() => {
    return async (): Promise<T> => {
      const response = await authenticatedFetch(apiEndpoint, fetchInit);
      return response.json();
    };
  }, [apiEndpoint, authenticatedFetch, fetchInit]);

  return useQuery<T, Error>([apiKey, apiEndpoint, ...dependency], fetch, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });
};

export default useFetchQuery;
