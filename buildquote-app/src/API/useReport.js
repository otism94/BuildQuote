import useSWR from "swr";
import fetcher from "./fetcher";

const useReport = (id) => {
  const { data, error, mutate } = useSWR(
    `https://localhost:5001/api/reports/${id}`,
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
    report: data,
    reportLoading: !error && !data,
    reportError: error,
    mutateReport: mutate,
  };
};

export default useReport;
