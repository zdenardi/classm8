import axios, { InternalAxiosRequestConfig, ResponseType } from "axios";
import { API_V1 } from "../constants/index.ts";
import tokenGetter from "./auth.ts";
import { ROUTES } from "./routes.ts";

export const apiAxiosV1 = axios.create({
  baseURL: `${API_V1}`,
  headers: {
    "Content-Type": "application/json",
  },
});
const AXIOS_INSTANCES = {
  v1: apiAxiosV1,
};

apiAxiosV1.interceptors.request.use(async (config) => {
  const token = await tokenGetter.getToken();
  config.headers.Authorization = `Bearer ${token}`;
  if (!config.headers["Content-Type"] && config.method !== "get") {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export const setPathParams = (
  url: string,
  params: { [key: string]: string },
) => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(`{${key}}`, value);
  }, url);
};

interface ServiceCallParams {
  method: InternalAxiosRequestConfig["method"];
  route: keyof typeof ROUTES;
  data?: InternalAxiosRequestConfig["data"];
  params?: InternalAxiosRequestConfig["params"];
  pathParams?: { [key: string]: string };
  headers?: InternalAxiosRequestConfig["headers"];
  version?: "v1";
  transformRequest?: InternalAxiosRequestConfig["transformRequest"];
  transformResponse?: InternalAxiosRequestConfig["transformResponse"];
  responseType?: ResponseType;
}

export const handleServiceCall = async ({
  method,
  route,
  data,
  params,
  pathParams,
  headers,
  transformRequest,
  version = "v1",
  transformResponse,
  responseType = "json",
}: ServiceCallParams) => {
  const response = await AXIOS_INSTANCES[version].request({
    method,
    url: setPathParams(
      ROUTES[route][method as keyof (typeof ROUTES)[typeof route]],
      pathParams || {},
    ),
    data,
    params,
    headers,
    transformRequest,
    transformResponse,
    responseType,
  });
  return response.data;
};

export const getData = async <T>(
  route: keyof typeof ROUTES,
): Promise<T> => {
  return handleServiceCall({
    method: "get",
    route: route,
  });
};

export const postData = async <T>(
  route: keyof typeof ROUTES,
  options?: Omit<ServiceCallParams, "method" | "route"> & {
    params?: { [key: string]: string | number };
  },
): Promise<T> => {
  return handleServiceCall({
    method: "post",
    route: route,
    ...options,
  });
};

export const deleteData = async (
  route: keyof typeof ROUTES,
  options?: Omit<ServiceCallParams, "method" | "route">,
) => {
  return handleServiceCall({
    method: "delete",
    route: route,
    ...options,
  });
};

export const putData = async <T>(
  route: keyof typeof ROUTES,
  options?: Omit<ServiceCallParams, "method" | "route">,
) => {
  return handleServiceCall({
    method: "put",
    route: route,
    ...options,
  });
};
