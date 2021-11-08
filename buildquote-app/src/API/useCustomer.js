import useSWR from "swr";
import fetcher from "./fetcher";

const useCustomer = (id, quotes = false) => {
  const { data, error, mutate } = useSWR(
    `https://localhost:5001/api/customers/${id}?quotes=${quotes}`,
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
    customer: data,
    customerLoading: !error && !data,
    customerError: error,
    mutateCustomer: mutate,
  };
};

export default useCustomer;
