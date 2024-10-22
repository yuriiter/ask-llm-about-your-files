import { AxiosRequestConfig } from "axios";

export type FetchStatusType = "error" | "pending" | "success" | "pause";

export type FetchError = {
  type: "error";
  statusCode: number;
  error: string;
};

export type FetchPending = {
  type: "pending";
};

export type FetchPause = {
  type: "pause";
};

export type FetchSuccess = {
  type: "success";
};

export type FetchStatus<T> = {
  type: FetchStatusType;
  data?: T;
} & (FetchError | FetchPending | FetchPause | FetchSuccess);

export type FetchCallback<T> = (
  fetchParams?: Pick<UseFetchParams, "requestConfig">,
) => Promise<FetchStatus<T>>;

export type PutCallback<T> = FetchCallback<T>;

export type GetCallback<
  Q extends Record<string, string | number | boolean | undefined>,
  T,
> = (
  fetchParams?: Pick<UseGetParams<Q>, "queryParams" | "requestConfig">,
) => Promise<FetchStatus<T>>;

export type PostCallback<D, T> = (
  fetchParams?: Pick<UsePostParams<D>, "data" | "requestConfig">,
) => Promise<FetchStatus<T>>;

export type UseFetchParams = {
  url: string;
  requestConfig?: AxiosRequestConfig;
  pause?: boolean;
};

export type UseGetParams<
  Q extends Record<string, string | number | boolean | undefined> = any,
> = {
  url: string;
  requestConfig?: AxiosRequestConfig;
  pause?: boolean;
  queryParams?: Q;
};

export type UsePostParams<D> = {
  url: string;
  requestConfig?: AxiosRequestConfig;
  pause?: boolean;
  data?: D;
};
