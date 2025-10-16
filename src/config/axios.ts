import axios from "axios";

export const AxiosPublic = axios.create({
  baseURL: window.location.hostname === "localhost" ? "http://10.10.13.60:8090/api" : "https://api.extrahanden.ai/api",
  withCredentials: true,
});

AxiosPublic.defaults.xsrfCookieName = "csrftoken";
AxiosPublic.defaults.xsrfHeaderName = "X-CSRFToken";

// optional: make sure all requests have JSON header
AxiosPublic.defaults.headers.common["Content-Type"] = "application/json";

AxiosPublic.interceptors.request.use((config) => {
  const accessKey = localStorage.getItem("access-key");
  if (accessKey) {
    config.headers.Authorization = accessKey;
  }
  return config;
});
