import { FetchStatus, UsePostParams, PostCallback } from "./types";
import { useFetch } from "./useFetch";

export const usePut = <T, D>({
  url,
  requestConfig,
  pause,
  data,
}: UsePostParams<D>): [FetchStatus<T>, PostCallback<D, T>] =>
  useFetch({
    url,
    requestConfig: { ...requestConfig, data, method: "PUT" },
    pause,
  });
