import useSWR from "swr";
import fetcher from "./fetcher";

const useQuoteProducts = () => {
  const { data, error, mutate } = useSWR("/api/quoteproducts", fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.response.status === 404) return;
      if (retryCount >= 10) return;
      setTimeout(() => revalidate({ retryCount }), 1000);
    },
  });

  return {
    quoteProducts: data,
    quoteProductsLoading: !error && !data,
    quoteProductsError: error,
    mutateQuoteProducts: mutate,
  };
};

export default useQuoteProducts;
