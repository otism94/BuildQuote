import useSWR from "swr";
import fetcher from "./fetcher";

const useQuotes = (products = false) => {
  const { data, error, mutate } = useSWR(
    `/api/quotes?products=${products}`,
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
    quotes: data,
    quotesLoading: !error && !data,
    quotesError: error,
    mutateQuotes: mutate,
  };
};

export default useQuotes;
