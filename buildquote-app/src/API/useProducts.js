import useSWR from "swr";
import fetcher from "./fetcher";

const useProducts = (categories = false) => {
  const { data, error, mutate } = useSWR(
    `/api/products?categories=${categories}`,
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
    products: data,
    productsLoading: !error && !data,
    productsError: error,
    mutateProducts: mutate,
  };
};

export default useProducts;
