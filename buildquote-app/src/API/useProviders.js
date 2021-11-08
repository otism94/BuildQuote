import useSWR from "swr";
import fetcher from "./fetcher";

const useProviders = (quotes = false) => {
  const { data, error, mutate } = useSWR(
    `https://localhost:5001/api/providers?quotes=${quotes}`,
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
    providers: data,
    providersLoading: !error && !data,
    providersError: error,
    mutateProviders: mutate,
  };
};

export default useProviders;
