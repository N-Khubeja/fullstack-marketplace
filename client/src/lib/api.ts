// import axios from "axios";
// import { useStoreAuth } from "@/store/useStoreAuth";

// export const api = axios.create({
//    baseURL: process.env.NEXT_PUBLIC_API_URL,  
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const token = useStoreAuth.getState().accessToken;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, Promise.reject);




// let isRefreshing = false;
// let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;


//     if (originalRequest.url === "/refresh") {
//     useStoreAuth.getState().clear();
//     return Promise.reject(error); 
//   }

//     if (error.response?.status !== 401 || originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     if (isRefreshing) {
//       return new Promise<string>((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then((token) => {
//         originalRequest.headers.Authorization = `Bearer ${token}`;
//         return api(originalRequest);
//       });
//     }

//     originalRequest._retry = true;
//     isRefreshing = true;

//     try {
//       const { data } = await api.post<{ accessToken: string }>("/refresh");

//       useStoreAuth.getState().setAccessToken(data.accessToken);
//       processQueue(null, data.accessToken);

//       originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//       return api(originalRequest);

//     } catch (err) {
//       processQueue(err, null);
//       useStoreAuth.getState().clear();
//       window.location.href = "/login";
//       return Promise.reject(err);

//     } finally {
//       isRefreshing = false;
//     }
//   }
// );


import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { useStoreAuth } from "@/store/useStoreAuth";


interface ApiErrorResponse {
  code?: string;
  message?: string;
}

interface RefreshResponse {
  accessToken: string;
}

interface RetryRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedQueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}


const baseURL =
  process.env.NEXT_PUBLIC_API_URL;


export const api = axios.create({
  baseURL,
  withCredentials: true,
});


const refreshApi = axios.create({
  baseURL,
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const accessToken =
      useStoreAuth.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


let isRefreshing = false;

let failedQueue: FailedQueueItem[] = [];


function processQueue(
  error: unknown,
  token: string | null = null
) {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
      return;
    }

    if (token) {
      request.resolve(token);
    }
  });

  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (
    error: AxiosError<ApiErrorResponse>
  ) => {
    const originalRequest =
      error.config as
        | RetryRequestConfig
        | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }


    const status =
      error.response?.status;

    const code =
      error.response?.data?.code;

    if (code === "SESSION_EXPIRED") {
      useStoreAuth
        .getState()
        .clear();

      if (
        typeof window !== "undefined"
      ) {
        window.location.href =
          "/login";
      }

      return Promise.reject(error);
    }


    if (
      code === "INVALID_ACCESS_TOKEN"
    ) {
      useStoreAuth
        .getState()
        .clear();

      if (
        typeof window !== "undefined"
      ) {
        window.location.href =
          "/login";
      }

      return Promise.reject(error);
    }


    if (
      status !== 401 ||
      code !==
        "ACCESS_TOKEN_EXPIRED" ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;


    if (isRefreshing) {
      return new Promise<string>(
        (resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }
      ).then((newAccessToken) => {
        originalRequest
          .headers
          .Authorization =
            `Bearer ${newAccessToken}`;

        return api(originalRequest);
      });
    }


    isRefreshing = true;

    try {

      // refreshToken HttpOnly cookie-შია.
      //
      // withCredentials:true-ის გამო
      // browser თვითონ გაუგზავნის cookie-ს.
      //
      // აქ refresh token-ის მნიშვნელობა
      // JavaScript-ს საერთოდ არ აქვს.

      const { data } =
        await refreshApi.post<RefreshResponse>(
          "/refresh"
        );


      const newAccessToken =
        data.accessToken;


      // ახალი access token
      // Zustand memory-ში
      useStoreAuth
        .getState()
        .setAccessToken(
          newAccessToken
        );


      // სანამ refresh მიმდინარეობდა,
      // დაგროვილი request-ებიც გავუშვათ
      processQueue(
        null,
        newAccessToken
      );


      // პირველი ჩავარდნილი request-იც
      // ახალი access token-ით გავიმეოროთ
      originalRequest
        .headers
        .Authorization =
          `Bearer ${newAccessToken}`;


      return api(originalRequest);

    } catch (refreshError) {

      // Queue-ში მყოფ ყველა request-ს
      // reject გავუკეთოთ
      processQueue(
        refreshError,
        null
      );


      // local auth state გავასუფთავოთ
      useStoreAuth
        .getState()
        .clear();


      // refresh token invalid/expired არის,
      // ამიტომ თავიდან login გვჭირდება
      if (
        typeof window !== "undefined"
      ) {
        window.location.href =
          "/login";
      }


      return Promise.reject(
        refreshError
      );

    } finally {

      isRefreshing = false;
    }
  }
);