import {
  FetchError,
  FetchStatus,
  UseFetchParams,
  FetchCallback,
} from "./types";
import { useCallback, useEffect, useRef, useState } from "react";
import axios, { CancelTokenSource, AxiosError, AxiosResponse } from "axios";

export const useFetch = <T>({
  url,
  requestConfig,
  pause,
}: UseFetchParams): [FetchStatus<T>, FetchCallback<T>] => {
  const [status, setStatus] = useState<FetchStatus<T>>(
    pause ? { type: "pause" } : { type: "pending" },
  );
  const cancelTokenSourceRef = useRef<CancelTokenSource>();

  const buildError = (statusCode: number, error: string): FetchError => ({
    type: "error",
    statusCode,
    error,
  });

  const fetchCallback: FetchCallback<T> = useCallback(
    async (callbackRequestConfig) => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Request canceled by cleanup");
      }
      const source = axios.CancelToken.source();
      cancelTokenSourceRef.current = source;

      let newStatus: FetchStatus<T> = { type: "pending" };
      setStatus((current) => ({ data: current.data, ...newStatus }));

      try {
        const response: AxiosResponse<T> = await axios.request<T>({
          url,
          withCredentials: true,
          cancelToken: source?.token,
          ...{ ...requestConfig, ...callbackRequestConfig },
        });

        newStatus = { type: "success", data: response.data };
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axios.isCancel(error)) {
          // Request was canceled
          newStatus = buildError(0, "Request cancelled");
          return newStatus;
        }

        if (axiosError.response) {
          const { status, statusText } = axiosError.response;
          newStatus = buildError(status, statusText || "Unknown error");
        } else if (axiosError.request) {
          newStatus = buildError(0, "Request made but no response received");
        } else {
          newStatus = buildError(0, axiosError.message || "Unknown error");
        }
      }

      setStatus((current) => ({ data: current.data, ...newStatus }));

      return newStatus;
    },
    [url, requestConfig],
  );

  useEffect(() => {
    if (pause) return;

    const fetchData = async () => {
      await fetchCallback({ requestConfig });
    };

    fetchData();

    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Request canceled by cleanup");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause, url]);

  return [status, fetchCallback];
};
