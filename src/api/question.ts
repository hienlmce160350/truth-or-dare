import { endpoints, fetcher } from "@/utils/axios";
import { createQueryKeys } from "@/utils/react-query/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const questionQueryKeys = createQueryKeys(["questions"], {
  list: () => ({
    key: [],
  }),
});

export function useGetquestionListQuery() {
  const URL = `${endpoints.question.list}`;

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: questionQueryKeys.list().key,
    queryFn: () => fetcher(URL),
  });

  const memoizedValue = useMemo(
    () => ({
      questions: data || [],
      questionsLoading: isLoading,
      questionsError: error,
      questionsEmpty: !isLoading && !data?.questions?.length,
      isError,
      questionTableRefetch: refetch,
    }),
    [data, isLoading, error, isError, refetch]
  );
  return memoizedValue;
}
