import useSWR from "swr";
import fetcher from "./fetcher";

const useReports = () => {
  const { data, error, mutate } = useSWR(
    "https://localhost:5001/api/reports",
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
    reports: data,
    reportsLoading: !error && !data,
    reportsError: error,
    mutateReports: mutate,
  };
};

export default useReports;
