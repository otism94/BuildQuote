import useSWR from "swr";
import fetcher from "./fetcher";

const useProvider = (id, quotes = false) => {
  const { data, error, mutate } = useSWR(
    `/api/providers/${id}?quotes=${quotes}`,
    fetcher,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.response.status === 404) return;
        if (retryCount >= 10) return;
        setTimeout(() => revalidate({ retryCount }), 1000);
      },
    }
  );

  return {
    provider: data,
    providerLoading: !error && !data,
    providerError: error,
    mutateProvider: mutate,
  };
};

export default useProvider;
