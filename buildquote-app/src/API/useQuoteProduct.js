import useSWR from "swr";
import fetcher from "./fetcher";

const useQuoteProduct = (id) => {
  const { data, error, mutate } = useSWR(`/api/quoteproducts/${id}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.response.status === 404) return;
      if (retryCount >= 10) return;
      setTimeout(() => revalidate({ retryCount }), 1000);
    },
  });

  return {
    quoteProduct: data,
    quoteProductLoading: !error && !data,
    quoteProductError: error,
    mutateQuoteProduct: mutate,
  };
};

export default useQuoteProduct;
