import useSWR from "swr";
import fetcher from "./fetcher";

const useQuote = (id) => {
  const { data, error, mutate } = useSWR(
    `https://localhost:5001/api/quotes/${id}`,
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
    quote: data,
    quoteLoading: !error && !data,
    quoteError: error,
    mutateQuote: mutate,
  };
};

export default useQuote;
