import { FetchStatus, UseGetParams, GetCallback } from "./types";

import { useFetch } from "./useFetch";
import { useMemo } from "react";

export const useGet = <
  T,
  Q extends Record<string, string | number | boolean | undefined> = any,
>({
  url,
  requestConfig,
  pause,
  queryParams,
}: UseGetParams<Q>): [FetchStatus<T>, GetCallback<Q, T>] => {
  const finalUrl = useMemo(() => {
    if (queryParams === undefined) return url;

    const newUrl = new URL(url);
    const params = new URLSearchParams(newUrl.search);

    Object.entries(queryParams).map(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value.toString());
      }
    });
    newUrl.search = params.toString();
    return newUrl.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(queryParams)]);

  return useFetch({ url: finalUrl, requestConfig, pause });
};
