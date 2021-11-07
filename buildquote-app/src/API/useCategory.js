import useSWR from "swr";
import fetcher from "./fetcher";

const useCategory = (id, products = false) => {
  const { data, error, mutate } = useSWR(
    `/api/categories/${id}?products=${products}`,
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
    category: data,
    categoryLoading: !error && !data,
    categoryError: error,
    mutateCategory: mutate,
  };
};

export default useCategory;
