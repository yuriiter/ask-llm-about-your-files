import { FetchStatus, UsePostParams, PostCallback } from "./types";
import { useFetch } from "./useFetch";

export const usePost = <T, D>({
  url,
  requestConfig,
  pause,
  data,
}: UsePostParams<D>): [FetchStatus<T>, PostCallback<D, T>] =>
  useFetch({
    url,
    requestConfig: { ...requestConfig, data, method: "POST" },
    pause,
  });
