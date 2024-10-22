import { FetchStatus, FetchCallback, UseFetchParams } from "./types";
import { useFetch } from "./useFetch";

export const useDelete = <T>({
  url,
  requestConfig,
  pause,
}: UseFetchParams): [FetchStatus<T>, FetchCallback<T>] =>
  useFetch({
    url,
    requestConfig: { ...requestConfig, method: "DELETE" },
    pause,
  });
