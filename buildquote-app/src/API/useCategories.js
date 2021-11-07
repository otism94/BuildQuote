import useSWR from "swr";
import fetcher from "./fetcher";

const useCategories = (products = false) => {
  const { data, error, mutate } = useSWR(
    `/api/categories?products=${products}`,
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
    categories: data,
    categoriesLoading: !error && !data,
    categoriesError: error,
    mutateCategories: mutate,
  };
};

export default useCategories;
