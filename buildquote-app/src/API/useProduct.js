import useSWR from "swr";
import fetcher from "./fetcher";

const useProduct = (id, categories = false) => {
  const { data, error, mutate } = useSWR(
    `https://localhost:5001/api/products/${id}?categories=${categories}`,
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
    product: data,
    productLoading: !error && !data,
    productError: error,
    mutateProduct: mutate,
  };
};

export default useProduct;
