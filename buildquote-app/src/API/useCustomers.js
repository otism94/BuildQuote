import useSWR from "swr";
import fetcher from "./fetcher";

const useCustomers = () => {
  const { data, error, mutate } = useSWR("/api/customers", fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.response.status === 404) return;
      if (retryCount >= 10) return;
      setTimeout(() => revalidate({ retryCount }), 1000);
    },
  });

  return {
    customers: data,
    customersLoading: !error && !data,
    customersError: error,
    mutateCustomers: mutate,
  };
};

export default useCustomers;
