import axios from "axios";
import { useStoreAuth } from "@/store/useStoreAuth";

export const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,  
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useStoreAuth.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, Promise.reject);




let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // if (originalRequest.url === "/refresh") {
    //   useStoreAuth.getState().clear();
    //   window.location.href = "/login";
    //   return Promise.reject(error);
    // }

    if (originalRequest.url === "/refresh") {
    useStoreAuth.getState().clear();
    return Promise.reject(error); 
  }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post<{ accessToken: string }>("/refresh");

      useStoreAuth.getState().setAccessToken(data.accessToken);
      processQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);

    } catch (err) {
      processQueue(err, null);
      useStoreAuth.getState().clear();
      window.location.href = "/login";
      return Promise.reject(err);
  //       processQueue(err, null);
  // useStoreAuth.getState().clear();
  // return Promise.reject(err);

    } finally {
      isRefreshing = false;
    }
  }
);