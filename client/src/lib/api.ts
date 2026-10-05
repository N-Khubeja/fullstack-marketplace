// import axios from "axios";
// import { clearAccessToken, getAccessToken, setAccessToken } from "@/store/authStore";

// export const api = axios.create({
//   baseURL: "http://localhost:3000/api",
//   withCredentials: true
// });


// api.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {

//       originalRequest._retry = true;

//       try {
//         const res = await api.post("/refresh");

//         const newAccessToken = res.data.accessToken;

//         setAccessToken(newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return api(originalRequest);

//       } catch (err) {
//         clearAccessToken();
//         window.location.href = "/login";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

//CHATGPT

// import axios, {
//   AxiosError,
//   InternalAxiosRequestConfig,
// } from "axios"

// import { useStoreAuth } from "@/store/useStoreAuth"

// const REFRESH_ENDPOINT = "/refresh"

// interface RetryAxiosRequestConfig
//   extends InternalAxiosRequestConfig {
//   _retry?: boolean
// }

// interface RefreshResponse {
//   accessToken: string
// }

// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// })

// const refreshApi = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// })

// api.interceptors.request.use(
//   (config) => {
//     const token =
//       useStoreAuth.getState().accessToken

//     if (token) {
//       config.headers.Authorization =
//         `Bearer ${token}`
//     }

//     return config
//   },
//   (error) => Promise.reject(error)
// )

// let isRefreshing = false

// let failedQueue: Array<{
//   resolve: (token: string) => void
//   reject: (error: unknown) => void
// }> = []

// const processQueue = (
//   error: unknown,
//   token: string | null = null
// ) => {
//   failedQueue.forEach(({ resolve, reject }) => {
//     if (error) {
//       reject(error)
//     } else if (token) {
//       resolve(token)
//     }
//   })

//   failedQueue = []
// }

// api.interceptors.response.use(
//   (response) => response,

//   async (error: AxiosError) => {
//     const originalRequest =
//       error.config as
//         | RetryAxiosRequestConfig
//         | undefined

//     if (!originalRequest) {
//       return Promise.reject(error)
//     }

//     if (
//       originalRequest.url === REFRESH_ENDPOINT
//     ) {
//       useStoreAuth.getState().clear()
//       return Promise.reject(error)
//     }

//     if (
//       error.response?.status !== 401 ||
//       originalRequest._retry
//     ) {
//       return Promise.reject(error)
//     }

//     originalRequest._retry = true

//     if (isRefreshing) {
//       return new Promise<string>(
//         (resolve, reject) => {
//           failedQueue.push({ resolve, reject })
//         }
//       ).then((token) => {
//         originalRequest.headers.Authorization =
//           `Bearer ${token}`

//         return api(originalRequest)
//       })
//     }

//     isRefreshing = true

//     try {
//       const { data } =
//         await refreshApi.post<RefreshResponse>(
//           REFRESH_ENDPOINT
//         )

//       useStoreAuth
//         .getState()
//         .setAccessToken(data.accessToken)

//       processQueue(null, data.accessToken)

//       originalRequest.headers.Authorization =
//         `Bearer ${data.accessToken}`

//       return api(originalRequest)
//     } catch (refreshError) {
//       processQueue(refreshError)

//       useStoreAuth.getState().clear()

//       if (typeof window !== "undefined") {
//         window.location.replace("/login")
//       }

//       return Promise.reject(refreshError)
//     } finally {
//       isRefreshing = false
//     }
//   }
// )




















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